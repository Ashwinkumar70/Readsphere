import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as readerController from '../controllers/readerController.js';

const router = express.Router();

// All routes are protected by authMiddleware
router.use(protect);

// Dashboard & General
router.get('/dashboard', readerController.getDashboard);
router.get('/library', readerController.getLibrary);
router.get('/continue-reading', readerController.getContinueReading);
router.get('/recommendations', readerController.getRecommendations);
router.get('/activity', readerController.getActivity);

// Reading Progress
router.get('/progress/:bookId', readerController.getProgress);
router.post('/progress', readerController.updateProgress);

// Reading Goal
router.get('/reading-goal', readerController.getReadingGoal);
router.put('/reading-goal', readerController.updateReadingGoal);

// Achievements
router.get('/achievements', readerController.getAchievements);

// Bookmarks (Page-specific)
router.get('/bookmarks', readerController.getBookmarks);
router.post('/bookmarks', readerController.addBookmark);
router.delete('/bookmarks/:id', readerController.deleteBookmark);

// Highlights
router.get('/highlights', readerController.getHighlights);
router.post('/highlights', readerController.addHighlight);
router.put('/highlights/:id', readerController.updateHighlight);
router.delete('/highlights/:id', readerController.deleteHighlight);

// Notes
router.get('/notes', readerController.getNotes);
router.post('/notes', readerController.addNote);
router.put('/notes/:id', readerController.updateNote);
router.delete('/notes/:id', readerController.deleteNote);

// Preferences & File Fetching
router.get('/preferences', readerController.getPreferences);
router.put('/preferences', readerController.updatePreferences);
router.get('/file/:bookId', readerController.getFileUrl);

export default router;
