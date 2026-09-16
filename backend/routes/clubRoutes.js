import express from 'express';
import { 
  getClubs, 
  createClub, 
  joinClub, 
  leaveClub, 
  postClubMessage, 
  getClubMessages, 
  updateMemberRole,
  editClubMessage,
  deleteClubMessage
} from '../controllers/clubController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload, uploadToSupabase } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getClubs)
  .post(protect, upload.single('image'), uploadToSupabase('club-images'), createClub);

// Membership routes
router.post('/:id/join', protect, joinClub);
router.post('/:id/leave', protect, leaveClub);
router.put('/:id/members/:userId/role', protect, updateMemberRole);

// Discussion routes
router.route('/:id/messages')
  .get(protect, getClubMessages)
  .post(protect, postClubMessage);

router.route('/messages/:msgId')
  .put(protect, editClubMessage)
  .delete(protect, deleteClubMessage);

export default router;
