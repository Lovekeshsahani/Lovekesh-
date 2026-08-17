import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class FavoriteModel {
  // Add to favorites
  static async add(userId, songId) {
    try {
      const id = uuidv4();
      const result = await pool.query(
        'INSERT INTO favorites (id, user_id, song_id) VALUES ($1, $2, $3) RETURNING *',
        [id, userId, songId]
      );
      // Update favorite count
      await pool.query('UPDATE songs SET favorite_count = favorite_count + 1 WHERE id = $1', [songId]);
      return result.rows[0];
    } catch (err) {
      console.error('Error adding favorite:', err);
      throw err;
    }
  }

  // Remove from favorites
  static async remove(userId, songId) {
    try {
      await pool.query('DELETE FROM favorites WHERE user_id = $1 AND song_id = $2', [userId, songId]);
      // Update favorite count
      await pool.query('UPDATE songs SET favorite_count = GREATEST(favorite_count - 1, 0) WHERE id = $1', [
        songId,
      ]);
      return true;
    } catch (err) {
      console.error('Error removing favorite:', err);
      throw err;
    }
  }

  // Get user favorites
  static async getUserFavorites(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT s.*, a.name as artist_name FROM favorites f
         JOIN songs s ON f.song_id = s.id
         JOIN artists a ON s.artist_id = a.id
         WHERE f.user_id = $1
         ORDER BY f.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching user favorites:', err);
      throw err;
    }
  }

  // Check if song is favorited
  static async isFavorited(userId, songId) {
    try {
      const result = await pool.query(
        'SELECT id FROM favorites WHERE user_id = $1 AND song_id = $2',
        [userId, songId]
      );
      return result.rows.length > 0;
    } catch (err) {
      console.error('Error checking if favorited:', err);
      return false;
    }
  }
}
