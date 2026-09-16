import { supabase } from '../config/supabase.js';

// ==========================================
// Dashboard & General
// ==========================================

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 1. Reading Progress & Stats
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

    // 2. Reading Goal
    const currentYear = new Date().getFullYear();
    const { data: goalData } = await supabase
      .from('reading_goals')
      .select('target_books')
      .eq('user_id', userId)
      .eq('year', currentYear)
      .single();
    
    const readingGoal = goalData?.target_books || 12;

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

    // 4. Recommendations
    const { data: latestBooks } = await supabase
      .from('books')
      .select('id, title, cover_url, average_rating, authors(name)')
      .eq('status', 'Published')
      .order('created_at', { ascending: false })
      .limit(5);

    const recommendations = (latestBooks || []).map(b => ({
      id: b.id, title: b.title, cover: b.cover_url, author: b.authors?.name || 'Unknown', rating: b.average_rating
    }));

    // 5. Clubs / Community
    const { data: userClubs } = await supabase
      .from('club_members')
      .select('clubs(id, name)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .limit(3);
    
    const clubs = (userClubs || []).map(uc => ({
      id: uc.clubs?.id,
      name: uc.clubs?.name
    }));

    res.json({
      booksRead,
      pagesRead,
      readingTime: Math.floor(pagesRead * 1.5) + 'm', // Fake stat for now
      readingStreak,
      readingGoal,
      currentlyReading,
      recentActivity,
      recommendations,
      clubs
    });
  } catch (error) {
    next(error);
  }
};

export const getLibrary = async (req, res, next) => {
  try {
    // For now, return purchased books or bookmarked books
    const { data: purchases } = await supabase
      .from('purchases')
      .select('books(id, title, cover_url, average_rating, authors(name))')
      .eq('user_id', req.user.id);

    const books = (purchases || []).map(p => ({
      id: p.books?.id,
      title: p.books?.title,
      cover: p.books?.cover_url,
      author: p.books?.authors?.name || 'Unknown',
      rating: p.books?.average_rating
    }));

    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getContinueReading = async (req, res, next) => {
  try {
    const { data: progress } = await supabase
      .from('reading_progress')
      .select('progress_percentage, current_page, books(id, title, cover_url, authors(name))')
      .eq('user_id', req.user.id)
      .is('completed_at', null)
      .gt('progress_percentage', 0);
      
    const books = (progress || []).map(p => ({
      id: p.books?.id,
      title: p.books?.title,
      cover: p.books?.cover_url,
      author: p.books?.authors?.name || 'Unknown',
      readProgress: p.progress_percentage,
      currentPage: p.current_page
    }));
    
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { data } = await supabase
      .from('books')
      .select('id, title, cover_url, average_rating, authors(name)')
      .eq('status', 'Published')
      .order('likes_count', { ascending: false })
      .limit(10);
      
    const books = (data || []).map(b => ({
      id: b.id, title: b.title, cover: b.cover_url, author: b.authors?.name || 'Unknown', rating: b.average_rating
    }));
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getActivity = async (req, res, next) => {
  try {
    const { data } = await supabase
      .from('reading_history')
      .select('action, created_at, books(title)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);
      
    const activity = (data || []).map(h => ({
      action: h.action,
      bookTitle: h.books?.title,
      date: h.created_at
    }));
    res.json(activity);
  } catch (error) {
    next(error);
  }
};


// ==========================================
// Reading Progress
// ==========================================

export const getProgress = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { data } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('book_id', bookId)
      .single();
    res.json(data || {});
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { bookId, currentPage, totalPages } = req.body;
    const progress_percentage = totalPages ? Math.round((currentPage / totalPages) * 100) : 0;
    
    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: req.user.id,
        book_id: bookId,
        current_page: currentPage,
        progress_percentage,
        last_read_at: new Date()
      }, { onConflict: 'user_id, book_id' })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Reading Goal
// ==========================================

export const getReadingGoal = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const { data } = await supabase
      .from('reading_goals')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('year', currentYear)
      .single();
    res.json(data || { target_books: 12, year: currentYear });
  } catch (error) {
    next(error);
  }
};

export const updateReadingGoal = async (req, res, next) => {
  try {
    const { target_books } = req.body;
    const currentYear = new Date().getFullYear();
    const { data, error } = await supabase
      .from('reading_goals')
      .upsert({
        user_id: req.user.id,
        year: currentYear,
        target_books
      }, { onConflict: 'user_id, year' })
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Achievements
// ==========================================

export const getAchievements = async (req, res, next) => {
  try {
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('unlocked_at, achievements(*)')
      .eq('user_id', req.user.id);
      
    const achievements = (userAchievements || []).map(ua => ({
      ...ua.achievements,
      unlocked_at: ua.unlocked_at
    }));
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Bookmarks (Page-specific)
// ==========================================

export const getBookmarks = async (req, res, next) => {
  try {
    const { bookId } = req.query;
    let query = supabase.from('page_bookmarks').select('*').eq('user_id', req.user.id);
    if (bookId) query = query.eq('book_id', bookId);
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const addBookmark = async (req, res, next) => {
  try {
    const { bookId, pageNumber, note } = req.body;
    const { data, error } = await supabase
      .from('page_bookmarks')
      .insert({ user_id: req.user.id, book_id: bookId, page_number: pageNumber, note })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteBookmark = async (req, res, next) => {
  try {
    const { error } = await supabase.from('page_bookmarks').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Highlights
// ==========================================

export const getHighlights = async (req, res, next) => {
  try {
    const { bookId } = req.query;
    let query = supabase.from('highlights').select('*').eq('user_id', req.user.id);
    if (bookId) query = query.eq('book_id', bookId);
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const addHighlight = async (req, res, next) => {
  try {
    const { bookId, pageNumber, textContent, color } = req.body;
    const { data, error } = await supabase
      .from('highlights')
      .insert({ user_id: req.user.id, book_id: bookId, page_number: pageNumber, text_content: textContent, color })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateHighlight = async (req, res, next) => {
  try {
    const { color } = req.body;
    const { data, error } = await supabase
      .from('highlights')
      .update({ color })
      .eq('id', req.params.id).eq('user_id', req.user.id)
      .select().single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteHighlight = async (req, res, next) => {
  try {
    const { error } = await supabase.from('highlights').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Notes
// ==========================================

export const getNotes = async (req, res, next) => {
  try {
    const { bookId } = req.query;
    let query = supabase.from('notes').select('*').eq('user_id', req.user.id);
    if (bookId) query = query.eq('book_id', bookId);
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const addNote = async (req, res, next) => {
  try {
    const { bookId, pageNumber, content } = req.body;
    const { data, error } = await supabase
      .from('notes')
      .insert({ user_id: req.user.id, book_id: bookId, page_number: pageNumber, content })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { data, error } = await supabase
      .from('notes')
      .update({ content })
      .eq('id', req.params.id).eq('user_id', req.user.id)
      .select().single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { error } = await supabase.from('notes').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Preferences & File Fetching
// ==========================================

export const getPreferences = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('reading_preferences')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle();

    if (error) throw error;
    
    // Return default preferences if none exist
    if (!data) {
      return res.json({
        font_size: 18,
        font_family: 'Georgia, serif',
        theme: 'light',
        brightness: 100,
        line_height: 1.5,
        margin: 24,
        reading_mode: 'scroll'
      });
    }
    
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const updates = { ...req.body, user_id: req.user.id };
    
    const { data, error } = await supabase
      .from('reading_preferences')
      .upsert(updates, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getFileUrl = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    
    // 1. Fetch book record to get the file path
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('pdf_path, is_free, status')
      .eq('id', bookId)
      .single();

    if (bookError) throw bookError;
    if (!book || !book.pdf_path) {
      return res.status(404).json({ message: 'Book file not found' });
    }

    // 2. Generate a signed URL valid for 1 hour (3600 seconds)
    const { data, error } = await supabase.storage
      .from('book-files')
      .createSignedUrl(book.pdf_path, 3600);

    if (error) throw error;
    
    res.json({ url: data.signedUrl });
  } catch (error) {
    next(error);
  }
};
