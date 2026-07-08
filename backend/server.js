import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Load env first, before anything else

// ── Environment validation ────────────────────────────────────────────────
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const app = express();

// ── Security headers (Helmet) ─────────────────────────────────────────────
app.use(helmet());

// ── CORS whitelist ────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsers ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));          // Prevent large JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Rate limiting ─────────────────────────────────────────────────────────
// Global: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// Strict limiter for auth routes: 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/ai', aiRoutes);

// ── Base routes ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'ReadSphere API', version: '2.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── Error handling ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ReadSphere API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
