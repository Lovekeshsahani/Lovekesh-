import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'gana_bajao',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || '30d',

  // Music Providers
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  APPLE_MUSIC_TOKEN: process.env.APPLE_MUSIC_TOKEN,
  YOUTUBE_MUSIC_API_KEY: process.env.YOUTUBE_MUSIC_API_KEY,

  // Admin
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@ganabajao.com',

  // Storage
  STORAGE_PATH: process.env.STORAGE_PATH || './uploads/downloads',
  MAX_DOWNLOAD_SIZE_MB: process.env.MAX_DOWNLOAD_SIZE_MB || 500,

  // Ads
  AD_PROVIDER: process.env.AD_PROVIDER || 'google_ad_manager',
  AD_PROVIDER_KEY: process.env.AD_PROVIDER_KEY,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
};

export default config;
