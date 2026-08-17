import pool from '../config/database.js';

// Database connection test
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
};

// Get total songs count (for scalability test)
export const getTotalSongsCount = async () => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM songs');
    return parseInt(result.rows[0].total);
  } catch (err) {
    console.error('Error getting songs count:', err);
    return 0;
  }
};

// Get songs with pagination
export const getSongsWithPagination = async (page = 1, limit = 20) => {
  try {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT s.*, a.name as artist_name FROM songs s
       JOIN artists a ON s.artist_id = a.id
       ORDER BY s.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching songs:', err);
    return [];
  }
};
