import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const SongModel = {
  async create(data) {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO songs (
        id, title, artist_id, album_id, duration, language_id,
        license_id, audio_url, cover_url, lyrics, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *`,
      [
        id,
        data.title,
        data.artistId,
        data.albumId,
        data.duration,
        data.languageId,
        data.licenseId,
        data.audioUrl,
        data.coverUrl,
        data.lyrics,
      ]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT s.*, a.name as artist_name, al.title as album_title, l.name as language_name
       FROM songs s
       LEFT JOIN artists a ON s.artist_id = a.id
       LEFT JOIN albums al ON s.album_id = al.id
       LEFT JOIN languages l ON s.language_id = l.id
       WHERE s.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT s.*, a.name as artist_name, al.title as album_title
       FROM songs s
       LEFT JOIN artists a ON s.artist_id = a.id
       LEFT JOIN albums al ON s.album_id = al.id
       WHERE s.is_deleted = false
       ORDER BY s.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async findTrending(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT s.*, a.name as artist_name, al.title as album_title
       FROM songs s
       LEFT JOIN artists a ON s.artist_id = a.id
       LEFT JOIN albums al ON s.album_id = al.id
       WHERE s.is_trending = true AND s.is_deleted = false
       ORDER BY s.play_count DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async findPopular(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT s.*, a.name as artist_name, al.title as album_title
       FROM songs s
       LEFT JOIN artists a ON s.artist_id = a.id
       LEFT JOIN albums al ON s.album_id = al.id
       WHERE s.is_popular = true AND s.is_deleted = false
       ORDER BY s.play_count DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async findNew(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT s.*, a.name as artist_name, al.title as album_title
       FROM songs s
       LEFT JOIN artists a ON s.artist_id = a.id
       LEFT JOIN albums al ON s.album_id = al.id
       WHERE s.is_new = true AND s.is_deleted = false
       ORDER BY s.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async search(query, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const searchQuery = `%${query}%`;
    const result = await pool.query(
      `SELECT s.*, a.name as artist_name, al.title as album_title
       FROM songs s
       LEFT JOIN artists a ON s.artist_id = a.id
       LEFT JOIN albums al ON s.album_id = al.id
       WHERE (s.title ILIKE $1 OR a.name ILIKE $1 OR al.title ILIKE $1)
       AND s.is_deleted = false
       ORDER BY s.play_count DESC
       LIMIT $2 OFFSET $3`,
      [searchQuery, limit, offset]
    );
    return result.rows;
  },

  async update(id, data) {
    const result = await pool.query(
      `UPDATE songs SET
       title = COALESCE($1, title),
       duration = COALESCE($2, duration),
       is_popular = COALESCE($3, is_popular),
       is_trending = COALESCE($4, is_trending),
       is_new = COALESCE($5, is_new),
       updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [data.title, data.duration, data.isPopular, data.isTrending, data.isNew, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('UPDATE songs SET is_deleted = true WHERE id = $1', [id]);
  },

  async incrementPlayCount(id) {
    await pool.query('UPDATE songs SET play_count = play_count + 1 WHERE id = $1', [id]);
  },
};

export const ArtistModel = {
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      'SELECT * FROM artists WHERE is_deleted = false ORDER BY name LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM artists WHERE id = $1 AND is_deleted = false',
      [id]
    );
    return result.rows[0];
  },
};

export const AlbumModel = {
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT a.*, ar.name as artist_name FROM albums a
       LEFT JOIN artists ar ON a.artist_id = ar.id
       WHERE a.is_deleted = false
       ORDER BY a.release_date DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT a.*, ar.name as artist_name FROM albums a
       LEFT JOIN artists ar ON a.artist_id = ar.id
       WHERE a.id = $1 AND a.is_deleted = false`,
      [id]
    );
    return result.rows[0];
  },
};
