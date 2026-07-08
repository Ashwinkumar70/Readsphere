import { supabase } from '../config/supabase.js';
import { body, validationResult } from 'express-validator';

// ── Validation rules ──────────────────────────────────────────────────────
export const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Helper to handle validation errors
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    return true;
  }
  return false;
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res, next) => {
  if (handleValidation(req, res)) return;

  try {
    const { name, email, password, role } = req.body;

    // Security: prevent self-assignment of privileged roles
    const allowedRoles = ['Reader', 'Author'];
    const userRole = allowedRoles.includes(role) ? role : 'Reader';

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: userRole }, // Stored in auth.users metadata
      },
    });

    if (authError) {
      res.status(400);
      throw new Error(authError.message);
    }

    // Create user profile in public.users
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert([{ id: authData.user.id, email: authData.user.email, name, role: userRole }])
      .select('id, name, email, role, avatar_url, created_at')
      .single();

    if (profileError) {
      // Cleanup: delete auth user if profile creation failed
      await supabase.auth.admin.deleteUser(authData.user.id);
      res.status(400);
      throw new Error(profileError.message);
    }

    res.status(201).json({
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      token: authData.session?.access_token || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res, next) => {
  if (handleValidation(req, res)) return;

  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, name, email, role, avatar_url, is_active')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !userProfile) {
      res.status(404);
      throw new Error('User profile not found');
    }

    // Reject banned/deactivated users
    if (!userProfile.is_active) {
      res.status(403);
      throw new Error('Your account has been deactivated. Contact support.');
    }

    // Update last login timestamp
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userProfile.id);

    res.json({
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      avatarUrl: userProfile.avatar_url,
      token: authData.session.access_token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res, next) => {
  try {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatarUrl: req.user.avatar_url,
      bio: req.user.bio,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio;

    let avatar_url = req.user.avatar_url;
    if (req.file?.supabaseUrl) {
      avatar_url = req.file.supabaseUrl;
      updates.avatar_url = avatar_url;
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, name, email, role, avatar_url, bio')
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logoutUser = async (req, res, next) => {
  try {
    // Invalidate the session server-side using admin API
    await supabase.auth.admin.signOut(req.user.id);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    // Even if signout fails, tell the client to clear their token
    res.json({ message: 'Logged out successfully' });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400);
      throw new Error('Valid email address required');
    }

    const redirectTo = process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/reset-password`
      : undefined;

    await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    // Always return success to prevent email enumeration attacks
    res.json({ message: 'If that email exists, a password reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 8) {
      res.status(400);
      throw new Error('Password must be at least 8 characters');
    }

    const { error } = await supabase.auth.admin.updateUserById(req.user.id, { password });

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for user
// @route   GET /api/auth/dashboard
const getDashboardData = async (req, res, next) => {
  try {
    // For now, return basic metrics. A full implementation would aggregate from `reading_sessions` or `purchases`
    const { data: userStats, error } = await supabase
      .from('users')
      .select('created_at, is_active')
      .eq('id', req.user.id)
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json({
      readingStreak: 0,
      pagesRead: 0,
      booksCompleted: 0,
      currentlyReading: [], // Empty array for now until Library module is built
      recommended: [], // Empty array for now
      weeklyData: [
        { label: 'Mon', value: 0 },
        { label: 'Tue', value: 0 },
        { label: 'Wed', value: 0 },
        { label: 'Thu', value: 0 },
        { label: 'Fri', value: 0 },
        { label: 'Sat', value: 0 },
        { label: 'Sun', value: 0 },
      ]
    });
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, getUserProfile, updateProfile, logoutUser, forgotPassword, resetPassword, getDashboardData };
