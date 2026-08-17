import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { config } from './config/environment.js';
import { testConnection } from './utils/database.js';
import { initializeProviders } from './providers/musicProviderManager.js';
import { createTables } from './migrations/schema.js';
import seedDatabase from './migrations/seed.js';
import pool from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import songRoutes from './routes/songs.js';
import favoriteRoutes from './routes/favorites.js';
import playlistRoutes from './routes/playlists.js';
import adminRoutes from './routes/admin.js';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later',
});
app.use(limiter);

// Database setup
const initializeDatabase = async () => {
  try {
    console.log('🔄 Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Could not connect to database');
    }

    console.log('🔄 Creating tables...');
    await createTables();

    console.log('🔄 Initializing music providers...');
    await initializeProviders();
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    console.log('⚠️  Continuing with server startup...');
  }
};

// Initialize on startup
await initializeDatabase();

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      message: 'Server is running',
      database: 'connected',
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      message: 'Server is running but database is unavailable',
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Gana Bajao API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      songs: '/api/songs',
      favorites: '/api/favorites',
      playlists: '/api/playlists',
      admin: '/api/admin',
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎵 Gana Bajao Backend Server`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`${'='.repeat(60)}\n`);
});

export default app;
