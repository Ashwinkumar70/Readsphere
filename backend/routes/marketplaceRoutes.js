import express from 'express';
import { 
  getWishlist, addToWishlist, removeFromWishlist, 
  purchaseBooks, getOrderHistory, 
  createSubscription, getSubscription 
} from '../controllers/marketplaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All marketplace routes require authentication

router.route('/wishlist')
  .get(getWishlist)
  .post(addToWishlist);

router.delete('/wishlist/:id', removeFromWishlist);

router.post('/purchase', purchaseBooks);
router.get('/orders', getOrderHistory);

router.route('/subscription')
  .get(getSubscription)
  .post(createSubscription);

export default router;
