import express from 'express';
import { sendMessage, executeAction } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/chat').post(protect, sendMessage);
router.route('/action').post(protect, executeAction);

export default router;
