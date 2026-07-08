import { supabase } from '../config/supabase.js';

// @desc    Get user's collections
// @route   GET /api/library/collections
// @access  Private
const getCollections = async (req, res, next) => {
  try {
    const { data: collections, error } = await supabase
      .from('collections')
      .select('*, collection_books(book:books(*))')
      .eq('user_id', req.user.id)
      .eq('is_active', true);

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(collections);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new collection
// @route   POST /api/library/collections
// @access  Private
const createCollection = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Collection name is required');
    }

    const { data: collection, error } = await supabase
      .from('collections')
      .insert([
        {
          user_id: req.user.id,
          name,
          description,
          is_public: isPublic || false,
        }
      ])
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(201).json(collection);
  } catch (error) {
    next(error);
  }
};

// @desc    Update reading progress
// @route   PUT /api/library/progress/:bookId
// @access  Private
const updateProgress = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
      res.status(400);
      throw new Error('Valid progress percentage is required (0-100)');
    }

    const { data: readingProgress, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: req.user.id,
        book_id: bookId,
        progress_percentage: progress,
        last_read_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,book_id' })
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(readingProgress);
  } catch (error) {
    next(error);
  }
};

export { getCollections, createCollection, updateProgress };
