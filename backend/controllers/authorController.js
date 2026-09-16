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
    // 1. Get the author record
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

    const bookIds = books.map(b => b.id);
    
    // 3. Get Order Items (Sales)
    let orderItems = [];
    if (bookIds.length > 0) {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*, orders!inner(status, created_at, user_id)')
        .in('book_id', bookIds);
        
      if (!itemsError && items) {
        // Filter only completed orders
        orderItems = items.filter(item => item.orders.status === 'Completed');
      }
    }

    // 4. Get Reviews
    let reviews = [];
    if (bookIds.length > 0) {
      const { data: revs, error: revsError } = await supabase
        .from('reviews')
        .select('*, users(name)')
        .in('book_id', bookIds)
        .order('created_at', { ascending: false });
        
      if (!revsError && revs) {
        reviews = revs;
      }
    }

    // Calculate Analytics
    const totalBooks = books.length;
    const publishedBooks = books.filter(b => b.status === 'Published').length;
    const draftBooks = books.filter(b => b.status === 'Draft').length;
    const pendingReview = books.filter(b => b.status === 'Pending Review').length;

    let totalRevenue = 0;
    let booksSold = 0;
    const uniqueReaders = new Set();
    const bookSalesMap = {}; // book_id -> quantity
    
    // Monthly aggregation
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    const today = new Date();
    for(let i = 5; i >= 0; i--) {
      let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthlyData[`${d.getFullYear()}-${d.getMonth()}`] = { 
        name: months[d.getMonth()], 
        revenue: 0, 
        sales: 0 
      };
    }

    orderItems.forEach(item => {
      const qty = item.quantity || 1;
      const sub = item.subtotal || 0;
      
      totalRevenue += sub;
      booksSold += qty;
      uniqueReaders.add(item.orders.user_id);
      
      bookSalesMap[item.book_id] = (bookSalesMap[item.book_id] || 0) + qty;
      
      const orderDate = new Date(item.orders.created_at);
      const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].revenue += sub;
        monthlyData[monthKey].sales += qty;
      }
    });

    const totalReaders = uniqueReaders.size;

    // Best Selling Book
    let bestSellingBookId = null;
    let maxSales = -1;
    for (const [bId, sales] of Object.entries(bookSalesMap)) {
      if (sales > maxSales) {
        maxSales = sales;
        bestSellingBookId = bId;
      }
    }
    const bestSellingBook = books.find(b => b.id === bestSellingBookId) || null;

    // Ratings
    let avgRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      avgRating = (sum / reviews.length).toFixed(1);
    }

    const latestReviews = reviews.slice(0, 5).map(r => ({
      ...r,
      reviewer: r.users?.name || 'Anonymous'
    }));

    // Format chart data
    const revenueData = Object.values(monthlyData);
    const monthlyRevenue = revenueData.length > 0 ? revenueData[revenueData.length - 1].revenue : 0;
    const monthlySales = revenueData.length > 0 ? revenueData[revenueData.length - 1].sales : 0;

    res.json({
      author,
      stats: {
        totalBooks,
        publishedBooks,
        draftBooks,
        pendingReview,
        totalRevenue,
        booksSold, // aka Downloads
        totalReaders,
        avgRating,
        totalReviews: reviews.length,
        monthlyRevenue,
        monthlySales
      },
      revenueData, // Used for charts
      bestSellingBook,
      latestReviews,
      books
    });
  } catch (error) {
    next(error);
  }
};

export { getAuthorProfile, getAuthorDashboardStats };
