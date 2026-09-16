import express from 'express';
import { handleAIGenerate, getAIHistory } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Ensure user is authenticated

router.post('/chat', (req, res, next) => { req.body.type = 'chat'; next(); }, handleAIGenerate);
router.post('/summarize', (req, res, next) => { req.body.type = 'summarize'; next(); }, handleAIGenerate);
router.post('/translate', (req, res, next) => { req.body.type = 'translate'; next(); }, handleAIGenerate);
router.post('/quiz', (req, res, next) => { req.body.type = 'quiz'; next(); }, handleAIGenerate);
router.post('/flashcards', (req, res, next) => { req.body.type = 'flashcards'; next(); }, handleAIGenerate);
router.post('/explain', (req, res, next) => { req.body.type = 'explain'; next(); }, handleAIGenerate);
router.post('/seo', (req, res, next) => { req.body.type = 'seo'; next(); }, handleAIGenerate);
router.post('/marketing', (req, res, next) => { req.body.type = 'marketing'; next(); }, handleAIGenerate);

router.get('/history', getAIHistory);

export default router;
