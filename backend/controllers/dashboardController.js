import { supabase } from '../config/supabase.js';

// Helper: Get safe reader stats
const buildReaderDashboard = async (userId) => {
  try {
    // 1. Reading Progress Stats
    const { data: progressData } = await supabase
      .from('reading_progress')
      .select('progress_percentage, current_page, reading_streak, completed_at, book_id, books(id, title, author_id, cover_url, authors(name))')
      .eq('user_id', userId);

    const progress = progressData || [];
    const booksRead = progress.filter(p => p.completed_at !== null).length;
    const pagesRead = progress.reduce((acc, p) => acc + (p.current_page || 0), 0);
    const readingStreak = progress.reduce((acc, p) => Math.max(acc, p.reading_streak || 0), 0);
    
    const currentlyReading = progress
      .filter(p => p.completed_at === null && p.progress_percentage > 0)
      .map(p => ({
        id: p.books?.id,
        title: p.books?.title,
        cover: p.books?.cover_url,
        author: p.books?.authors?.name || 'Unknown',
        readProgress: p.progress_percentage
      })).slice(0, 4);

    // 2. Recent & Recommendations (Safe defaults: 5 latest books)
    const { data: latestBooks } = await supabase
      .from('books')
      .select('id, title, cover_url, average_rating, authors(name)')
      .eq('status', 'Published')
      .order('created_at', { ascending: false })
      .limit(10);

    const recentBooks = (latestBooks || []).slice(0, 5).map(b => ({
      id: b.id, title: b.title, cover: b.cover_url, author: b.authors?.name || 'Unknown', rating: b.average_rating
    }));
    const recommendations = (latestBooks || []).slice(5, 10).map(b => ({
      id: b.id, title: b.title, cover: b.cover_url, author: b.authors?.name || 'Unknown', rating: b.average_rating
    }));

    // 3. Recent Activity
    const { data: historyData } = await supabase
      .from('reading_history')
      .select('action, created_at, books(title)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentActivity = (historyData || []).map(h => ({
      action: h.action,
      bookTitle: h.books?.title,
      date: h.created_at
    }));

    return {
      booksRead,
      pagesRead,
      readingStreak,
      readingGoal: 20, // Default safe value
      currentlyReading,
      recommendations,
      recentBooks,
      favoriteGenres: [], // Can implement later
      recentActivity
    };
  } catch (error) {
    console.error('Reader Dashboard Error:', error);
    return { booksRead: 0, pagesRead: 0, readingStreak: 0, currentlyReading: [], recommendations: [], recentBooks: [], favoriteGenres: [], recentActivity: [] };
  }
};

// Helper: Get safe author stats
const buildAuthorDashboard = async (userId) => {
  try {
    // 0. Get Author ID
    const { data: authorData } = await supabase
      .from('authors')
      .select('id')
      .eq('user_id', userId)
      .single();

    const authorId = authorData?.id;

    // 1. Author Books
    let booksData = [];
    if (authorId) {
      const { data } = await supabase
        .from('books')
        .select('id, title, status, downloads, average_rating, price, cover_url, created_at')
        .eq('author_id', authorId);
      booksData = data;
    }

    const books = booksData || [];
    const totalBooks = books.length;
    const publishedBooksCount = books.filter(b => b.status === 'Published').length;
    const draftBooksCount = books.filter(b => b.status === 'Draft' || b.status === 'Pending Review').length;
    const downloads = books.reduce((acc, b) => acc + (b.downloads || 0), 0);

    // 2. Sales and Revenue
    const bookIds = books.map(b => b.id);
    let revenue = 0;
    let sales = 0;
    let recentPurchases = [];
    let monthlySalesChart = [
      { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
      { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 }
    ];

    if (bookIds.length > 0) {
      const { data: purchasesData } = await supabase
        .from('purchases')
        .select('amount, created_at, books(title)')
        .in('book_id', bookIds)
        .order('created_at', { ascending: false });
        
      const purchases = purchasesData || [];
      sales = purchases.length;
      revenue = purchases.reduce((acc, p) => acc + Number(p.amount || 0), 0);
      
      recentPurchases = purchases.slice(0, 5).map(p => ({
        amount: p.amount,
        bookTitle: p.books?.title,
        date: p.created_at
      }));

      // Map to monthly chart safely
      purchases.forEach(p => {
        const date = new Date(p.created_at);
        const monthIndex = date.getMonth(); // 0 = Jan, 1 = Feb
        if (monthIndex < 6) { // Just populate first 6 months for simple safe visual
          monthlySalesChart[monthIndex].value += Number(p.amount || 0);
        }
      });
    }

    // 3. Readers (Unique users who progressed in author's books)
    let readers = 0;
    if (bookIds.length > 0) {
      const { data: progressData } = await supabase
        .from('reading_progress')
        .select('user_id')
        .in('book_id', bookIds);
      const uniqueReaders = new Set((progressData || []).map(p => p.user_id));
      readers = uniqueReaders.size;
    }

    // 4. Recent Reviews
    let recentReviews = [];
    if (bookIds.length > 0) {
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('rating, comment, created_at, users(name), books(title)')
        .in('book_id', bookIds)
        .order('created_at', { ascending: false })
        .limit(5);
        
      recentReviews = (reviewsData || []).map(r => ({
        reviewer: r.users?.name || 'Anonymous',
        bookTitle: r.books?.title,
        rating: r.rating,
        comment: r.comment,
        date: r.created_at
      }));
    }

    // 5. Best Selling Book
    let bestSellingBook = null;
    if (books.length > 0) {
      // Very naive safely - just pick highest price or first book if no sales
      bestSellingBook = books[0];
    }

    return {
      totalBooks,
      publishedBooks: publishedBooksCount,
      draftBooks: draftBooksCount,
      readers,
      downloads,
      revenue,
      sales,
      monthlySalesChart,
      recentReviews,
      recentPurchases,
      bestSellingBook,
      booksList: books.slice(0, 5) // Recent books for table
    };
  } catch (error) {
    console.error('Author Dashboard Error:', error);
    return { totalBooks: 0, publishedBooks: 0, draftBooks: 0, readers: 0, downloads: 0, revenue: 0, sales: 0, monthlySalesChart: [], recentReviews: [], recentPurchases: [], bestSellingBook: null, booksList: [] };
  }
};

// Main Controller
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role; // Reader, Author, ReaderAuthor
    
    // Notifications (Common for all roles)
    const { data: notificationsData } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5);
      
    const notifications = notificationsData || [];

    if (role === 'Reader') {
      const readerData = await buildReaderDashboard(userId);
      return res.json({ role, ...readerData, notifications });
    }

    if (role === 'Author') {
      const authorData = await buildAuthorDashboard(userId);
      return res.json({ role, ...authorData, notifications });
    }

    if (role === 'ReaderAuthor') {
      const readerData = await buildReaderDashboard(userId);
      const authorData = await buildAuthorDashboard(userId);
      return res.json({ 
        role,
        reader: readerData,
        author: authorData,
        combined: {
          monthlyRevenue: authorData.monthlySalesChart,
          readingProgress: readerData.booksRead,
          topSellingBook: authorData.bestSellingBook,
          recommendedBooks: readerData.recommendations,
          recentReviews: authorData.recentReviews,
        },
        notifications
      });
    }

    // Fallback safe default
    res.json({ role, notifications });
  } catch (error) {
    next(error);
  }
};
