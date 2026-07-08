import { supabase } from '../config/supabase.js';

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Admin
const getAnalytics = async (req, res, next) => {
  try {
    // Use Promise.all with head:true for COUNT queries (no row data fetched)
    const [
      { count: totalUsers },
      { count: totalBooks },
      { count: totalClubs },
      { count: totalPurchases },
      { count: pendingBooks },
      { count: activeSubscriptions },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('books').select('*', { count: 'exact', head: true }),
      supabase.from('clubs').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('purchases').select('*', { count: 'exact', head: true }),
      supabase.from('books').select('*', { count: 'exact', head: true }).eq('status', 'Pending Review'),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
    ]);

    // Use SQL function for revenue sum (O(1) vs fetching all rows)
    const { data: revenueData, error: revenueError } = await supabase.rpc('get_total_revenue');
    const totalRevenue = revenueError ? 0 : (revenueData || 0);

    res.json({
      totalUsers,
      totalBooks,
      totalClubs,
      totalPurchases,
      pendingBooks,
      activeSubscriptions,
      totalRevenue: parseFloat(totalRevenue).toFixed(2),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (paginated + filterable)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('users')
      .select('id, name, email, role, avatar_url, is_active, last_login, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    if (role)   query = query.eq('role', role);

    const { data: users, error, count } = await query;
    if (error) { res.status(400); throw new Error(error.message); }

    res.json({ users, total: count, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single user
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !user) { res.status(404); throw new Error('User not found'); }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res, next) => {
  try {
    const { role, is_active } = req.body;
    const updates = {};

    if (role !== undefined) {
      if (!['Reader', 'Author', 'Moderator', 'Admin'].includes(role)) {
        res.status(400); throw new Error('Invalid role value');
      }
      updates.role = role;
    }
    if (is_active !== undefined) updates.is_active = Boolean(is_active);

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.params.id)
      .select('id, name, email, role, is_active')
      .single();

    if (error) { res.status(400); throw new Error(error.message); }
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Soft-delete and ban a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      res.status(400); throw new Error('Cannot deactivate your own account');
    }

    // Soft delete in DB
    await supabase
      .from('users')
      .update({ is_active: false, deleted_at: new Date().toISOString(), deleted_by: req.user.id })
      .eq('id', userId);

    // Also ban in Supabase Auth so they cannot log in
    await supabase.auth.admin.updateUserById(userId, { ban_duration: '876000h' }); // ~100 years

    res.json({ message: 'User deactivated and banned successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a user's purchase history
// @route   GET /api/admin/users/:id/purchases
// @access  Admin
const getUserPurchases = async (req, res, next) => {
  try {
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*, book:books(title, cover_url)')
      .eq('user_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) { res.status(400); throw new Error(error.message); }
    res.json(purchases);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all authors
// @route   GET /api/admin/authors
// @access  Admin
const getAllAuthors = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    const { data: authors, error, count } = await supabase
      .from('authors')
      .select('*, user:users(id, name, email, avatar_url, is_active), books(count)', { count: 'exact' })
      .range(from, to);

    if (error) { res.status(400); throw new Error(error.message); }
    res.json({ authors, total: count, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books (admin view with status filter)
// @route   GET /api/admin/books
// @access  Admin
const getAllBooks = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('books')
      .select('id, title, status, price, is_free, views, rating_count, average_rating, created_at, author:authors(users(name, email))', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (status) query = query.eq('status', status);

    const { data: books, error, count } = await query;
    if (error) { res.status(400); throw new Error(error.message); }

    res.json({ books, total: count, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a book
// @route   PUT /api/admin/books/:id/approve
// @access  Admin
const approveBook = async (req, res, next) => {
  try {
    const { data: book, error } = await supabase
      .from('books')
      .update({ status: 'Published' })
      .eq('id', req.params.id)
      .eq('status', 'Pending Review')
      .select('id, title, author_id')
      .single();

    if (error || !book) {
      res.status(400);
      throw new Error('Book not found or not pending review');
    }

    await supabase.from('notifications').insert([{
      user_id: book.author_id,
      type: 'book_approved',
      title: 'Book Approved!',
      content: `Your book "${book.title}" has been approved and is now published.`,
    }]);

    res.json({ message: 'Book approved and published', book });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a book
// @route   PUT /api/admin/books/:id/reject
// @access  Admin
const rejectBook = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const { data: book, error } = await supabase
      .from('books')
      .update({ status: 'Rejected' })
      .eq('id', req.params.id)
      .select('id, title, author_id')
      .single();

    if (error || !book) {
      res.status(400);
      throw new Error('Book not found');
    }

    await supabase.from('notifications').insert([{
      user_id: book.author_id,
      type: 'book_rejected',
      title: 'Book Submission Rejected',
      content: reason || `Your book "${book.title}" was rejected. Please review and resubmit.`,
    }]);

    res.json({ message: 'Book rejected', book });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all clubs
// @route   GET /api/admin/clubs
// @access  Admin
const getAllClubs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    const { data: clubs, error, count } = await supabase
      .from('clubs')
      .select('id, name, is_public, is_active, member_count, created_at, owner:users!owner_id(name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) { res.status(400); throw new Error(error.message); }
    res.json({ clubs, total: count, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Enable or disable a club
// @route   PUT /api/admin/clubs/:id
// @access  Admin
const updateClub = async (req, res, next) => {
  try {
    const { is_active } = req.body;

    const { data: club, error } = await supabase
      .from('clubs')
      .update({ is_active: Boolean(is_active) })
      .eq('id', req.params.id)
      .select('id, name, is_active')
      .single();

    if (error) { res.status(400); throw new Error(error.message); }
    res.json(club);
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activity report
// @route   GET /api/admin/reports
// @access  Admin
const getReports = async (req, res, next) => {
  try {
    const { from: fromDate, to: toDate } = req.query;

    let purchasesQuery = supabase
      .from('purchases')
      .select('id, amount, created_at, book:books(title), user:users(name, email)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (fromDate) purchasesQuery = purchasesQuery.gte('created_at', fromDate);
    if (toDate)   purchasesQuery = purchasesQuery.lte('created_at', toDate);

    const [
      { data: recentUsers },
      { data: recentBooks },
      { data: purchases },
    ] = await Promise.all([
      supabase.from('users').select('id, name, email, role, created_at').order('created_at', { ascending: false }).limit(10),
      supabase.from('books').select('id, title, status, created_at, author:authors(users(name))').order('created_at', { ascending: false }).limit(10),
      purchasesQuery,
    ]);

    res.json({ recentUsers, recentBooks, purchases });
  } catch (error) {
    next(error);
  }
};

export {
  getAnalytics,
  getAllUsers, getUserById, updateUser, deleteUser, getUserPurchases,
  getAllAuthors,
  getAllBooks, approveBook, rejectBook,
  getAllClubs, updateClub,
  getReports,
};
