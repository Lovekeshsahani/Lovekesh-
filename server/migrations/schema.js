import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const createTables = async () => {
  try {
    await pool.query(`
      -- Users Table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        bio TEXT,
        avatar_url VARCHAR(500),
        is_premium BOOLEAN DEFAULT false,
        is_admin BOOLEAN DEFAULT false,
        is_verified BOOLEAN DEFAULT false,
        language_preference VARCHAR(10) DEFAULT 'en',
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Artists Table
      CREATE TABLE IF NOT EXISTS artists (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url VARCHAR(500),
        verified BOOLEAN DEFAULT false,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Albums Table
      CREATE TABLE IF NOT EXISTS albums (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist_id UUID REFERENCES artists(id),
        cover_url VARCHAR(500),
        release_date DATE,
        description TEXT,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Languages Table
      CREATE TABLE IF NOT EXISTS languages (
        id UUID PRIMARY KEY,
        code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(50) NOT NULL,
        native_name VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Genres Table
      CREATE TABLE IF NOT EXISTS genres (
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Music Licenses Table
      CREATE TABLE IF NOT EXISTS music_licenses (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        provider VARCHAR(255),
        allows_offline_download BOOLEAN DEFAULT false,
        license_type VARCHAR(50),
        license_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Songs Table
      CREATE TABLE IF NOT EXISTS songs (
        id UUID PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        artist_id UUID REFERENCES artists(id),
        album_id UUID REFERENCES albums(id),
        duration INTEGER,
        language_id UUID REFERENCES languages(id),
        license_id UUID REFERENCES music_licenses(id),
        audio_url VARCHAR(500) NOT NULL,
        cover_url VARCHAR(500),
        lyrics TEXT,
        is_popular BOOLEAN DEFAULT false,
        is_trending BOOLEAN DEFAULT false,
        is_new BOOLEAN DEFAULT false,
        play_count INTEGER DEFAULT 0,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Favorites Table
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, song_id)
      );

      -- Playlists Table
      CREATE TABLE IF NOT EXISTS playlists (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cover_url VARCHAR(500),
        is_public BOOLEAN DEFAULT false,
        song_count INTEGER DEFAULT 0,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Playlist Songs Table
      CREATE TABLE IF NOT EXISTS playlist_songs (
        id UUID PRIMARY KEY,
        playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
        song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
        position INTEGER,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(playlist_id, song_id)
      );

      -- Downloaded Songs Table
      CREATE TABLE IF NOT EXISTS downloaded_songs (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
        file_path VARCHAR(500),
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, song_id)
      );

      -- Advertisements Table
      CREATE TABLE IF NOT EXISTS advertisements (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        ad_url VARCHAR(500),
        duration_seconds INTEGER DEFAULT 20,
        frequency_after_songs INTEGER DEFAULT 3,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Admin Logs Table
      CREATE TABLE IF NOT EXISTS admin_logs (
        id UUID PRIMARY KEY,
        admin_id UUID REFERENCES users(id),
        action VARCHAR(50),
        entity_type VARCHAR(50),
        entity_id UUID,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create Indexes
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
      CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);
      CREATE INDEX IF NOT EXISTS idx_songs_language_id ON songs(language_id);
      CREATE INDEX IF NOT EXISTS idx_songs_is_popular ON songs(is_popular);
      CREATE INDEX IF NOT EXISTS idx_songs_is_trending ON songs(is_trending);
      CREATE INDEX IF NOT EXISTS idx_songs_play_count ON songs(play_count);
      CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
      CREATE INDEX IF NOT EXISTS idx_favorites_song_id ON favorites(song_id);
      CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
      CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
      CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id ON playlist_songs(song_id);
      CREATE INDEX IF NOT EXISTS idx_downloaded_songs_user_id ON downloaded_songs(user_id);
    `);
    console.log('✅ Database tables created successfully');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
    throw err;
  }
};
