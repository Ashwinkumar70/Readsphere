import express from 'express';
import { sendContactMessage, validateContactMessage } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', validateContactMessage, sendContactMessage);

export default router;
