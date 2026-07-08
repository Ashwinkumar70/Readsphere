import { supabase } from '../config/supabase.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Cryptographically verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }

    // Fetch full profile with role and status
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, name, email, role, avatar_url, bio, is_active')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return res.status(401).json({ message: 'User profile not found' });
    }

    // Reject deactivated/banned users on every request
    if (!userProfile.is_active) {
      return res.status(403).json({ message: 'Account has been deactivated' });
    }

    req.user = userProfile;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export { protect };
