import { supabase } from '../config/supabase.js';

// @desc    Fetch all books (with search and filter)
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    
    // Base query: fetch books with author details
    let query = supabase
      .from('books')
      .select('*, author:authors(bio, users(name, avatar_url))');

    // Default to only showing Published books unless a specific status is requested
    if (status) {
      query = query.eq('status', status);
    } else {
      query = query.eq('status', 'Published');
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data: books, error } = await query;

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(books);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res, next) => {
  try {
    const { data: book, error } = await supabase
      .from('books')
      .select('*, author:authors(bio, users(name, avatar_url)), reviews(*, users(name, avatar_url))')
      .eq('id', req.params.id)
      .single();

    if (error || !book) {
      res.status(404);
      throw new Error('Book not found');
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a book (Author Upload)
// @route   POST /api/books
// @access  Private/Author
const createBook = async (req, res, next) => {
  try {
    const { title, description, price, is_free, status, categories } = req.body;
    
    let cover_url = req.body.cover_url || null;
    let pdf_url = req.body.pdf_url || null;

    if (req.files) {
        if (req.files.cover && req.files.cover.length > 0) cover_url = req.files.cover[0].supabaseUrl;
        if (req.files.pdf && req.files.pdf.length > 0) pdf_url = req.files.pdf[0].supabaseUrl;
    } else if (req.file) {
        cover_url = req.file.supabaseUrl;
    }

    const bookStatus = status || 'Draft';
    const bookPrice = is_free === 'true' || is_free === true ? 0 : (price || 0);
    const bookIsFree = bookPrice === 0;

    // Check if author profile exists, if not, create one for this user
    const { data: authorCheck } = await supabase.from('authors').select('id').eq('id', req.user.id).single();
    if (!authorCheck) {
        await supabase.from('authors').insert([{ id: req.user.id, bio: '' }]);
    }

    const { data: book, error } = await supabase
      .from('books')
      .insert([
        {
          author_id: req.user.id,
          title,
          description,
          price: bookPrice,
          is_free: bookIsFree,
          cover_url,
          pdf_url,
          status: bookStatus
        }
      ])
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Author
const updateBook = async (req, res, next) => {
  try {
    const { title, description, price, is_free, status } = req.body;
    
    const { data: existingBook, error: findError } = await supabase
      .from('books')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !existingBook) {
      res.status(404);
      throw new Error('Book not found');
    }

    if (existingBook.author_id !== req.user.id && req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Not authorized to update this book');
    }

    const { data: updatedBook, error } = await supabase
      .from('books')
      .update({
        title: title || existingBook.title,
        description: description || existingBook.description,
        price: price !== undefined ? price : existingBook.price,
        is_free: is_free !== undefined ? is_free : existingBook.is_free,
        status: status || existingBook.status
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Author
const deleteBook = async (req, res, next) => {
  try {
    const { data: existingBook, error: findError } = await supabase
      .from('books')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !existingBook) {
      res.status(404);
      throw new Error('Book not found');
    }

    if (existingBook.author_id !== req.user.id && req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Not authorized to delete this book');
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    next(error);
  }
};

export { getBooks, getBookById, createBook, updateBook, deleteBook };
