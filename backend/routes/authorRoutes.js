import express from 'express';
import { getAuthorProfile, getAuthorDashboardStats } from '../controllers/authorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/dashboard')
  .get(protect, getAuthorDashboardStats);

router.route('/:id')
  .get(getAuthorProfile);

export default router;
