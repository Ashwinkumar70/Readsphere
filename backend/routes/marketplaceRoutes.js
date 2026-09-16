import express from 'express';
import { getCart, addToCart, checkout, getSecureDownload, getOrders } from '../controllers/marketplaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/cart')
  .get(protect, getCart)
  .post(protect, addToCart);
  
router.route('/checkout')
  .post(protect, checkout);

router.route('/downloads/:bookId')
  .get(protect, getSecureDownload);

router.route('/orders')
  .get(protect, getOrders);

export default router;
