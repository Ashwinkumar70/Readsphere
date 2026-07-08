import { supabase } from '../config/supabase.js';

// @desc    Get author profile and books
// @route   GET /api/authors/:id
// @access  Public
const getAuthorProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch author details
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .select('*, users(name, avatar_url, created_at)')
      .eq('id', id)
      .single();

    if (authorError || !author) {
      res.status(404);
      throw new Error('Author not found');
    }

    // Fetch author's books
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*')
      .eq('author_id', id)
      .order('published_date', { ascending: false });

    if (booksError) {
      res.status(400);
      throw new Error(booksError.message);
    }

    res.json({
      ...author,
      books: books || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get author dashboard stats
// @route   GET /api/authors/dashboard
// @access  Private
const getAuthorDashboardStats = async (req, res, next) => {
  try {
    // 1. Get the author record for the logged in user
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (authorError || !author) {
      res.status(404);
      throw new Error('Author profile not found for this user');
    }

    // 2. Get author's books
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*')
      .eq('author_id', author.id);

    if (booksError) {
      res.status(400);
      throw new Error(booksError.message);
    }

    // 3. Compute stats (mocking revenue calculation logic based on books)
    const booksCount = books ? books.length : 0;
    
    // In a real app, revenue and sales would come from a transactions table
    // Since we don't have a transactions table, we'll calculate dummy stats based on book prices
    let totalRevenue = 0;
    let booksSold = 0;
    let totalReaders = 0;
    let totalRating = 0;
    let ratedBooks = 0;

    if (books && books.length > 0) {
      books.forEach(book => {
        // Dummy logic for dashboard stats
        const sold = Math.floor(Math.random() * 500); 
        booksSold += sold;
        totalRevenue += (book.price || 0) * sold;
        totalReaders += sold + Math.floor(Math.random() * 200);
        
        if (book.rating) {
          totalRating += book.rating;
          ratedBooks += 1;
        }
      });
    }

    const avgRating = ratedBooks > 0 ? (totalRating / ratedBooks).toFixed(1) : 0;

    // Dummy chart data
    const revenueData = [
      { name: 'Jan', value: Math.floor(Math.random() * 5000) },
      { name: 'Feb', value: Math.floor(Math.random() * 5000) },
      { name: 'Mar', value: Math.floor(Math.random() * 5000) },
      { name: 'Apr', value: Math.floor(Math.random() * 5000) },
      { name: 'May', value: Math.floor(Math.random() * 5000) },
      { name: 'Jun', value: Math.floor(Math.random() * 5000) }
    ];

    res.json({
      author,
      stats: {
        totalRevenue,
        booksSold,
        totalReaders,
        avgRating
      },
      revenueData,
      books: books || []
    });
  } catch (error) {
    next(error);
  }
};

export { getAuthorProfile, getAuthorDashboardStats };
