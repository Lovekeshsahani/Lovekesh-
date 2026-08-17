import express from 'express';
import { SongModel } from '../models/SongModel.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Middleware: Check admin
router.use(verifyToken, isAdmin);

// Add new song
router.post('/songs', async (req, res) => {
  try {
    const { title, artistId, albumId, duration, languageId, licenseId, audioUrl, coverUrl, lyrics } = req.body;

    if (!title || !artistId || !duration || !languageId || !audioUrl) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const song = await SongModel.create({
      title,
      artistId,
      albumId,
      duration,
      languageId,
      licenseId,
      audioUrl,
      coverUrl,
      lyrics,
    });

    // Log admin action
    await pool.query(
      `INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.userId, 'CREATE', 'SONG', song.id, JSON.stringify({ title })]
    );

    res.status(201).json({
      success: true,
      message: 'Song created',
      data: song,
    });
  } catch (err) {
    console.error('Add song error:', err);
    res.status(500).json({ success: false, error: 'Failed to add song' });
  }
});

// Update song
router.put('/songs/:id', async (req, res) => {
  try {
    const { title, duration, isPopular, isTrending, isNew } = req.body;

    const song = await SongModel.update(req.params.id, {
      title,
      duration,
      isPopular,
      isTrending,
      isNew,
    });

    // Log admin action
    await pool.query(
      `INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.userId, 'UPDATE', 'SONG', req.params.id, JSON.stringify(req.body)]
    );

    res.json({
      success: true,
      message: 'Song updated',
      data: song,
    });
  } catch (err) {
    console.error('Update song error:', err);
    res.status(500).json({ success: false, error: 'Failed to update song' });
  }
});

// Delete song
router.delete('/songs/:id', async (req, res) => {
  try {
    await SongModel.delete(req.params.id);

    // Log admin action
    await pool.query(
      `INSERT INTO admin_logs (admin_id, action, entity_type, entity_id)
       VALUES ($1, $2, $3, $4)`,
      [req.user.userId, 'DELETE', 'SONG', req.params.id]
    );

    res.json({
      success: true,
      message: 'Song deleted',
    });
  } catch (err) {
    console.error('Delete song error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete song' });
  }
});

// Add artist
router.post('/artists', async (req, res) => {
  try {
    const { name, bio, imageUrl } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Artist name required' });
    }

    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO artists (id, name, bio, image_url, verified) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, name, bio, imageUrl, true]
    );

    // Log admin action
    await pool.query(
      `INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.userId, 'CREATE', 'ARTIST', id, JSON.stringify({ name })]
    );

    res.status(201).json({
      success: true,
      message: 'Artist created',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Add artist error:', err);
    res.status(500).json({ success: false, error: 'Failed to add artist' });
  }
});

// Add album
router.post('/albums', async (req, res) => {
  try {
    const { title, artistId, coverUrl, releaseDate, description } = req.body;
    if (!title || !artistId) {
      return res.status(400).json({ success: false, error: 'Title and artist ID required' });
    }

    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO albums (id, title, artist_id, cover_url, release_date, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, title, artistId, coverUrl, releaseDate, description]
    );

    // Log admin action
    await pool.query(
      `INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.userId, 'CREATE', 'ALBUM', id, JSON.stringify({ title })]
    );

    res.status(201).json({
      success: true,
      message: 'Album created',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Add album error:', err);
    res.status(500).json({ success: false, error: 'Failed to add album' });
  }
});

// Get all languages
router.get('/languages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM languages WHERE is_active = true ORDER BY name');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error('Get languages error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch languages' });
  }
});

// Add language
router.post('/languages', async (req, res) => {
  try {
    const { code, name, nativeName } = req.body;
    if (!code || !name) {
      return res.status(400).json({ success: false, error: 'Code and name required' });
    }

    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO languages (id, code, name, native_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, code, name, nativeName]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Add language error:', err);
    res.status(500).json({ success: false, error: 'Failed to add language' });
  }
});

// Get all genres
router.get('/genres', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM genres WHERE is_active = true ORDER BY name');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error('Get genres error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch genres' });
  }
});

// Add genre
router.post('/genres', async (req, res) => {
  try {
    const { name, description, iconUrl } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Genre name required' });
    }

    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO genres (id, name, description, icon_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name, description, iconUrl]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Add genre error:', err);
    res.status(500).json({ success: false, error: 'Failed to add genre' });
  }
});

// Get music licenses
router.get('/licenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM music_licenses ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error('Get licenses error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch licenses' });
  }
});

// Add license
router.post('/licenses', async (req, res) => {
  try {
    const { name, provider, allowsOfflineDownload, licenseType, licenseUrl } = req.body;
    if (!name || !provider) {
      return res.status(400).json({ success: false, error: 'Name and provider required' });
    }

    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO music_licenses (id, name, provider, allows_offline_download, license_type, license_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, name, provider, allowsOfflineDownload || false, licenseType, licenseUrl]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Add license error:', err);
    res.status(500).json({ success: false, error: 'Failed to add license' });
  }
});

// Get advertisements
router.get('/advertisements', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100);
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM advertisements ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error('Get advertisements error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch advertisements' });
  }
});

// Add advertisement
router.post('/advertisements', async (req, res) => {
  try {
    const { title, description, adUrl, durationSeconds, frequencyAfterSongs, isActive } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Ad title required' });
    }

    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO advertisements (id, title, description, ad_url, duration_seconds, frequency_after_songs, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, title, description, adUrl, durationSeconds || 20, frequencyAfterSongs || 3, isActive ?? true]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Add advertisement error:', err);
    res.status(500).json({ success: false, error: 'Failed to add advertisement' });
  }
});

// Get admin statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = {};

    // Total users
    const usersResult = await pool.query('SELECT COUNT(*) as total FROM users');
    stats.totalUsers = parseInt(usersResult.rows[0].total);

    // Premium users
    const premiumResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE is_premium = true');
    stats.premiumUsers = parseInt(premiumResult.rows[0].total);

    // Total songs
    const songsResult = await pool.query('SELECT COUNT(*) as total FROM songs');
    stats.totalSongs = parseInt(songsResult.rows[0].total);

    // Total artists
    const artistsResult = await pool.query('SELECT COUNT(*) as total FROM artists');
    stats.totalArtists = parseInt(artistsResult.rows[0].total);

    // Total plays (sum of play_count)
    const playsResult = await pool.query('SELECT SUM(play_count) as total FROM songs');
    stats.totalPlays = parseInt(playsResult.rows[0].total || 0);

    // Total favorites
    const favoritesResult = await pool.query('SELECT COUNT(*) as total FROM favorites');
    stats.totalFavorites = parseInt(favoritesResult.rows[0].total);

    // Total playlists
    const playlistsResult = await pool.query('SELECT COUNT(*) as total FROM playlists');
    stats.totalPlaylists = parseInt(playlistsResult.rows[0].total);

    // Total downloads
    const downloadsResult = await pool.query('SELECT COUNT(*) as total FROM downloaded_songs');
    stats.totalDownloads = parseInt(downloadsResult.rows[0].total);

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error('Get statistics error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

// Get admin logs
router.get('/logs', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 50, 100);
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT al.*, u.username FROM admin_logs al
       LEFT JOIN users u ON al.admin_id = u.id
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error('Get logs error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch logs' });
  }
});

export default router;
