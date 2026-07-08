import express from 'express';
import { getCollections, createCollection, updateProgress } from '../controllers/libraryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/collections')
  .get(protect, getCollections)
  .post(protect, createCollection);

router.route('/progress/:bookId')
  .put(protect, updateProgress);

export default router;
