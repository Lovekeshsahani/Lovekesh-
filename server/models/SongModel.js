import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class SongModel {
  // Create new song
  static async create(songData) {
    try {
      const {
        title,
        artistId,
        albumId,
        duration,
        languageId,
        licenseId,
        audioUrl,
        coverUrl,
        lyrics,
        provider,
        providerId,
        allowOfflineDownload,
      } = songData;

      const id = uuidv4();

      const result = await pool.query(
        `INSERT INTO songs (
          id, title, artist_id, album_id, duration, language_id, license_id,
          audio_url, cover_url, lyrics, provider, provider_id, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
        RETURNING *`,
        [
          id,
          title,
          artistId,
          albumId,
          duration,
          languageId,
          licenseId,
          audioUrl,
          coverUrl,
          lyrics,
          provider,
          providerId,
        ]
      );

      return result.rows[0];
    } catch (err) {
      console.error('Error creating song:', err);
      throw err;
    }
  }

  // Get song by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name, al.title as album_title, l.name as language_name
         FROM songs s
         LEFT JOIN artists a ON s.artist_id = a.id
         LEFT JOIN albums al ON s.album_id = al.id
         LEFT JOIN languages l ON s.language_id = l.id
         WHERE s.id = $1`,
        [id]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error finding song:', err);
      throw err;
    }
  }

  // Get songs by artist
  static async findByArtist(artistId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name FROM songs s
         JOIN artists a ON s.artist_id = a.id
         WHERE s.artist_id = $1
         ORDER BY s.created_at DESC
         LIMIT $2 OFFSET $3`,
        [artistId, limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error finding songs by artist:', err);
      throw err;
    }
  }

  // Get songs by album
  static async findByAlbum(albumId, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name FROM songs s
         JOIN artists a ON s.artist_id = a.id
         WHERE s.album_id = $1
         ORDER BY s.created_at DESC
         LIMIT $2 OFFSET $3`,
        [albumId, limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error finding songs by album:', err);
      throw err;
    }
  }

  // Get songs by language
  static async findByLanguage(languageId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name, l.name as language_name
         FROM songs s
         JOIN artists a ON s.artist_id = a.id
         JOIN languages l ON s.language_id = l.id
         WHERE s.language_id = $1
         ORDER BY s.is_trending DESC, s.play_count DESC
         LIMIT $2 OFFSET $3`,
        [languageId, limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error finding songs by language:', err);
      throw err;
    }
  }

  // Get songs by genre
  static async findByGenre(genreId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name
         FROM songs s
         JOIN artists a ON s.artist_id = a.id
         JOIN song_genres sg ON s.id = sg.song_id
         WHERE sg.genre_id = $1
         ORDER BY s.play_count DESC
         LIMIT $2 OFFSET $3`,
        [genreId, limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error finding songs by genre:', err);
      throw err;
    }
  }

  // Get trending songs
  static async getTrending(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name FROM songs s
         JOIN artists a ON s.artist_id = a.id
         WHERE s.is_trending = true
         ORDER BY s.play_count DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching trending songs:', err);
      throw err;
    }
  }

  // Get popular songs
  static async getPopular(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name FROM songs s
         JOIN artists a ON s.artist_id = a.id
         WHERE s.is_popular = true
         ORDER BY s.play_count DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching popular songs:', err);
      throw err;
    }
  }

  // Get new songs (released in last 30 days)
  static async getNew(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name FROM songs s
         JOIN artists a ON s.artist_id = a.id
         WHERE s.is_new = true OR s.created_at > NOW() - INTERVAL '30 days'
         ORDER BY s.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching new songs:', err);
      throw err;
    }
  }

  // Search songs
  static async search(query, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const searchQuery = `%${query}%`;
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name FROM songs s
         JOIN artists a ON s.artist_id = a.id
         WHERE s.title ILIKE $1 OR a.name ILIKE $1
         ORDER BY s.play_count DESC
         LIMIT $2 OFFSET $3`,
        [searchQuery, limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error searching songs:', err);
      throw err;
    }
  }

  // Update play count
  static async incrementPlayCount(id) {
    try {
      await pool.query('UPDATE songs SET play_count = play_count + 1 WHERE id = $1', [id]);
    } catch (err) {
      console.error('Error incrementing play count:', err);
    }
  }

  // Update song (admin)
  static async update(id, updates) {
    try {
      const { title, duration, isPopular, isTrending, isNew, allowOfflineDownload } = updates;
      const result = await pool.query(
        `UPDATE songs SET
          title = COALESCE($2, title),
          duration = COALESCE($3, duration),
          is_popular = COALESCE($4, is_popular),
          is_trending = COALESCE($5, is_trending),
          is_new = COALESCE($6, is_new),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id, title, duration, isPopular, isTrending, isNew]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error updating song:', err);
      throw err;
    }
  }

  // Delete song (admin)
  static async delete(id) {
    try {
      await pool.query('DELETE FROM songs WHERE id = $1', [id]);
      return true;
    } catch (err) {
      console.error('Error deleting song:', err);
      throw err;
    }
  }

  // Get total song count
  static async getTotalCount() {
    try {
      const result = await pool.query('SELECT COUNT(*) as total FROM songs');
      return parseInt(result.rows[0].total);
    } catch (err) {
      console.error('Error getting song count:', err);
      return 0;
    }
  }
}
