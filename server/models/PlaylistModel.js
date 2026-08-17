import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class PlaylistModel {
  // Create playlist
  static async create(userId, name, description = null, isPublic = false) {
    try {
      const id = uuidv4();
      const result = await pool.query(
        `INSERT INTO playlists (id, user_id, name, description, is_public)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [id, userId, name, description, isPublic]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error creating playlist:', err);
      throw err;
    }
  }

  // Get user playlists
  static async getUserPlaylists(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT * FROM playlists WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching user playlists:', err);
      throw err;
    }
  }

  // Get playlist details
  static async getById(playlistId) {
    try {
      const result = await pool.query('SELECT * FROM playlists WHERE id = $1', [playlistId]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error fetching playlist:', err);
      throw err;
    }
  }

  // Get playlist songs
  static async getPlaylistSongs(playlistId, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name FROM playlist_songs ps
         JOIN songs s ON ps.song_id = s.id
         JOIN artists a ON s.artist_id = a.id
         WHERE ps.playlist_id = $1
         ORDER BY ps.position ASC
         LIMIT $2 OFFSET $3`,
        [playlistId, limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching playlist songs:', err);
      throw err;
    }
  }

  // Add song to playlist
  static async addSong(playlistId, songId) {
    try {
      // Get current max position
      const posResult = await pool.query('SELECT MAX(position) as max_pos FROM playlist_songs WHERE playlist_id = $1', [
        playlistId,
      ]);
      const position = (posResult.rows[0]?.max_pos || 0) + 1;

      const id = uuidv4();
      await pool.query(
        `INSERT INTO playlist_songs (id, playlist_id, song_id, position)
         VALUES ($1, $2, $3, $4)`,
        [id, playlistId, songId, position]
      );

      // Update song count
      await pool.query('UPDATE playlists SET song_count = song_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [
        playlistId,
      ]);

      return true;
    } catch (err) {
      console.error('Error adding song to playlist:', err);
      throw err;
    }
  }

  // Remove song from playlist
  static async removeSong(playlistId, songId) {
    try {
      await pool.query(
        'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
        [playlistId, songId]
      );

      // Update song count
      await pool.query('UPDATE playlists SET song_count = GREATEST(song_count - 1, 0), updated_at = CURRENT_TIMESTAMP WHERE id = $1', [
        playlistId,
      ]);

      return true;
    } catch (err) {
      console.error('Error removing song from playlist:', err);
      throw err;
    }
  }

  // Update playlist
  static async update(playlistId, updates) {
    try {
      const { name, description, isPublic, coverUrl } = updates;
      const result = await pool.query(
        `UPDATE playlists SET
          name = COALESCE($2, name),
          description = COALESCE($3, description),
          is_public = COALESCE($4, is_public),
          cover_url = COALESCE($5, cover_url),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [playlistId, name, description, isPublic, coverUrl]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error updating playlist:', err);
      throw err;
    }
  }

  // Delete playlist
  static async delete(playlistId) {
    try {
      await pool.query('DELETE FROM playlists WHERE id = $1', [playlistId]);
      return true;
    } catch (err) {
      console.error('Error deleting playlist:', err);
      throw err;
    }
  }
}
