import { marketplaceService } from '../services/marketplaceService.js';

// @desc    Get user's shopping cart
// @route   GET /api/v1/marketplace/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cart = await marketplaceService.getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/marketplace/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;
    if (!bookId) {
      res.status(400);
      throw new Error('Book ID is required');
    }
    const cart = await marketplaceService.addToCart(req.user.id, bookId, quantity);
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Process checkout
// @route   POST /api/v1/marketplace/checkout
// @access  Private
const checkout = async (req, res, next) => {
  try {
    const { paymentDetails, shippingAddressId } = req.body;
    if (!paymentDetails) {
      res.status(400);
      throw new Error('Payment details are required');
    }
    const result = await marketplaceService.checkout(req.user.id, paymentDetails, shippingAddressId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get secure digital download URL
// @route   GET /api/v1/marketplace/downloads/:bookId
// @access  Private
const getSecureDownload = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const result = await marketplaceService.getSecureDownloadUrl(req.user.id, bookId);
    res.json(result);
  } catch (error) {
    res.status(403);
    next(error);
  }
};

// @desc    Get order history
// @route   GET /api/v1/marketplace/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const orders = await marketplaceService.getOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export {
  getCart,
  addToCart,
  checkout,
  getSecureDownload,
  getOrders
};
