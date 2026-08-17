import pool from '../config/database.js';

// Create all tables
const createTables = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        avatar_url TEXT,
        bio TEXT,
        is_premium BOOLEAN DEFAULT false,
        role VARCHAR(50) DEFAULT 'user',
        language_preference VARCHAR(50) DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);

    // Languages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS languages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(10) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        native_name VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Genres table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS genres (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Artists table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS artists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url TEXT,
        verified BOOLEAN DEFAULT false,
        follower_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);
    `);

    // Albums table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS albums (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
        cover_url TEXT,
        release_date DATE,
        description TEXT,
        total_songs INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON albums(artist_id);
      CREATE INDEX IF NOT EXISTS idx_albums_title ON albums(title);
    `);

    // Music Licenses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS music_licenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        provider VARCHAR(100) NOT NULL,
        allows_offline_download BOOLEAN DEFAULT false,
        allows_streaming BOOLEAN DEFAULT true,
        allows_sharing BOOLEAN DEFAULT false,
        allows_commercial_use BOOLEAN DEFAULT false,
        license_type VARCHAR(50),
        license_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Songs table (scalable - no hard limit)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS songs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
        album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
        duration INT NOT NULL,
        language_id UUID NOT NULL REFERENCES languages(id),
        license_id UUID REFERENCES music_licenses(id),
        audio_url TEXT NOT NULL,
        cover_url TEXT,
        lyrics TEXT,
        play_count INT DEFAULT 0,
        favorite_count INT DEFAULT 0,
        release_date DATE,
        is_trending BOOLEAN DEFAULT false,
        is_popular BOOLEAN DEFAULT false,
        is_new BOOLEAN DEFAULT false,
        provider VARCHAR(100),
        provider_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
      CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);
      CREATE INDEX IF NOT EXISTS idx_songs_language_id ON songs(language_id);
      CREATE INDEX IF NOT EXISTS idx_songs_license_id ON songs(license_id);
      CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
      CREATE INDEX IF NOT EXISTS idx_songs_is_trending ON songs(is_trending);
      CREATE INDEX IF NOT EXISTS idx_songs_is_popular ON songs(is_popular);
      CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs(created_at DESC);
    `);

    // Song-Genre junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS song_genres (
        song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
        genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
        PRIMARY KEY (song_id, genre_id)
      );
      CREATE INDEX IF NOT EXISTS idx_song_genres_genre_id ON song_genres(genre_id);
    `);

    // Favorites table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, song_id)
      );
      CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
      CREATE INDEX IF NOT EXISTS idx_favorites_song_id ON favorites(song_id);
    `);

    // Listening History table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS listening_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        duration_played INT
      );
      CREATE INDEX IF NOT EXISTS idx_listening_history_user_id ON listening_history(user_id);
      CREATE INDEX IF NOT EXISTS idx_listening_history_played_at ON listening_history(played_at DESC);
    `);

    // Playlists table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS playlists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cover_url TEXT,
        is_public BOOLEAN DEFAULT false,
        song_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
    `);

    // Playlist Songs junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS playlist_songs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
        song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
        position INT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(playlist_id, song_id)
      );
      CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
    `);

    // Downloaded Songs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS downloaded_songs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
        file_path TEXT NOT NULL,
        file_size_mb INT,
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, song_id)
      );
      CREATE INDEX IF NOT EXISTS idx_downloaded_songs_user_id ON downloaded_songs(user_id);
    `);

    // Advertisements table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS advertisements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        ad_url TEXT,
        duration_seconds INT,
        provider VARCHAR(100),
        provider_id VARCHAR(255),
        frequency_after_songs INT DEFAULT 3,
        target_language_id UUID REFERENCES languages(id),
        is_active BOOLEAN DEFAULT true,
        start_date DATE,
        end_date DATE,
        impression_count INT DEFAULT 0,
        click_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_advertisements_is_active ON advertisements(is_active);
    `);

    // Music Provider Credentials table (for secure credential storage)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS music_provider_credentials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        provider_name VARCHAR(100) NOT NULL UNIQUE,
        client_id VARCHAR(255),
        client_secret VARCHAR(255),
        access_token TEXT,
        refresh_token TEXT,
        token_expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Admin Actions Log table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_id UUID NOT NULL REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100),
        entity_id UUID,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
      CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
    `);

    // Statistics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS statistics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        date DATE NOT NULL,
        total_users INT DEFAULT 0,
        premium_users INT DEFAULT 0,
        total_songs INT DEFAULT 0,
        total_plays INT DEFAULT 0,
        total_downloads INT DEFAULT 0,
        active_users INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_statistics_date ON statistics(date DESC);
    `);

    console.log('✅ All tables created successfully');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  }
};

// Drop all tables (for dev/testing only)
const dropTables = async () => {
  try {
    console.log('🔄 Dropping all tables...');
    await pool.query(`
      DROP TABLE IF EXISTS admin_logs CASCADE;
      DROP TABLE IF EXISTS statistics CASCADE;
      DROP TABLE IF EXISTS music_provider_credentials CASCADE;
      DROP TABLE IF EXISTS advertisements CASCADE;
      DROP TABLE IF EXISTS downloaded_songs CASCADE;
      DROP TABLE IF EXISTS playlist_songs CASCADE;
      DROP TABLE IF EXISTS playlists CASCADE;
      DROP TABLE IF EXISTS listening_history CASCADE;
      DROP TABLE IF EXISTS favorites CASCADE;
      DROP TABLE IF EXISTS song_genres CASCADE;
      DROP TABLE IF EXISTS songs CASCADE;
      DROP TABLE IF EXISTS music_licenses CASCADE;
      DROP TABLE IF EXISTS albums CASCADE;
      DROP TABLE IF EXISTS artists CASCADE;
      DROP TABLE IF EXISTS genres CASCADE;
      DROP TABLE IF EXISTS languages CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('✅ All tables dropped');
  } catch (err) {
    console.error('❌ Drop tables error:', err.message);
    process.exit(1);
  }
};

export { createTables, dropTables };
