import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getDirectMessages,
  sendDirectMessage,
  getConversations,
  sendAnnouncement,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect); // All notification routes require authentication

// Notification routes
router.route('/')
  .get(getNotifications);

router.put('/read-all', markAllNotificationsRead);

router.route('/:id/read')
  .put(markNotificationRead);

router.route('/:id')
  .delete(deleteNotification);

// Direct message routes
router.route('/messages')
  .get(getConversations)
  .post(sendDirectMessage);

router.get('/messages/:userId', getDirectMessages);

// Announcement route (Admin only)
router.post('/announcements', authorizeRoles('Admin'), sendAnnouncement);

export default router;
