import { supabase } from '../config/supabase.js';

// --- WISHLIST (Using bookmarks table) ---

// @desc    Get user wishlist
// @route   GET /api/marketplace/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const { data: wishlist, error } = await supabase
      .from('bookmarks')
      .select('id, book:books(*, author:authors(bio, users(name, avatar_url)))')
      .eq('user_id', req.user.id);

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Add book to wishlist
// @route   POST /api/marketplace/wishlist
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.body;

    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('book_id', bookId)
      .single();

    if (existing) {
      res.status(400);
      throw new Error('Book already in wishlist');
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: req.user.id, book_id: bookId }])
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(201).json({ message: 'Added to wishlist', data });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/marketplace/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};


// --- PURCHASES & PAYMENTS (Cart Checkout) ---

// @desc    Process a purchase (Checkout cart)
// @route   POST /api/marketplace/purchase
// @access  Private
const purchaseBooks = async (req, res, next) => {
  try {
    const { bookIds, amount, currency } = req.body; 

    if (!bookIds || bookIds.length === 0) {
      res.status(400);
      throw new Error('No books selected for purchase');
    }

    // Record the payment
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([{ 
        user_id: req.user.id, 
        amount, 
        currency: currency || 'USD', 
        status: 'Completed' 
      }])
      .select()
      .single();

    if (paymentError) {
      res.status(400);
      throw new Error(paymentError.message);
    }

    // Record individual purchases
    const purchaseRecords = bookIds.map(bookId => ({
      user_id: req.user.id,
      book_id: bookId,
      amount: amount / bookIds.length, 
    }));

    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert(purchaseRecords);

    if (purchaseError) {
      res.status(400);
      throw new Error(purchaseError.message);
    }

    res.status(201).json({ message: 'Purchase successful', payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order history
// @route   GET /api/marketplace/orders
// @access  Private
const getOrderHistory = async (req, res, next) => {
  try {
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*, book:books(title, cover_url, price, author_id)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(purchases);
  } catch (error) {
    next(error);
  }
};


// --- SUBSCRIPTIONS ---

// @desc    Create or update subscription
// @route   POST /api/marketplace/subscribe
// @access  Private
const createSubscription = async (req, res, next) => {
  try {
    const { plan, durationMonths } = req.body;
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (durationMonths || 1));

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: req.user.id,
        plan,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'Active'
      }])
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current subscription
// @route   GET /api/marketplace/subscription
// @access  Private
const getSubscription = async (req, res, next) => {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'Active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.json({ status: 'Inactive' });
    } else if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(subscription);
  } catch (error) {
    next(error);
  }
};

export { 
  getWishlist, addToWishlist, removeFromWishlist, 
  purchaseBooks, getOrderHistory, 
  createSubscription, getSubscription 
};
