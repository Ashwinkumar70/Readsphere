import express from 'express';
import {
  getAnalytics,
  getAllUsers, getUserById, updateUser, deleteUser, getUserPurchases,
  getAllAuthors,
  getAllBooks, approveBook, rejectBook,
  getAllClubs, updateClub,
  getReports,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All admin routes require authentication and Admin role
router.use(protect);
router.use(authorizeRoles('Admin'));

// User management
router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.get('/users/:id/purchases', getUserPurchases);

// Author management
router.get('/authors', getAllAuthors);

// Book moderation
router.get('/books', getAllBooks);
router.put('/books/:id/approve', approveBook);
router.put('/books/:id/reject', rejectBook);

// Club management
router.route('/clubs')
  .get(getAllClubs);

router.route('/clubs/:id')
  .put(updateClub);

// Analytics & Reports
router.get('/analytics', getAnalytics);
router.get('/reports', getReports);

export default router;
