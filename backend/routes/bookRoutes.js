import express from 'express';
import { getBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { upload, uploadToSupabase } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(
    protect, 
    authorizeRoles('Author', 'Admin'), 
    upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), 
    uploadToSupabase('book-covers'), 
    createBook
  );

router.route('/:id')
  .get(getBookById)
  .put(protect, authorizeRoles('Author', 'Admin'), updateBook)
  .delete(protect, authorizeRoles('Author', 'Admin'), deleteBook);

export default router;
