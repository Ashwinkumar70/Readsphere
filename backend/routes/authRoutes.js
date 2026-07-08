import { registerUser, loginUser, getUserProfile, updateProfile, logoutUser, forgotPassword, resetPassword, validateRegister, validateLogin, getDashboardData } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload, uploadToSupabase } from '../middleware/uploadMiddleware.js';
import express from 'express';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/logout', protect, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', protect, resetPassword);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('avatar'), uploadToSupabase('avatars'), updateProfile);

router.get('/dashboard', protect, getDashboardData);

export default router;
