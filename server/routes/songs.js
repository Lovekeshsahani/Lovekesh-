import express from 'express';
import { SongModel } from '../models/SongModel.js';
import { validatePagination } from '../middleware/validation.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all songs with pagination (scalable)
router.get('/', validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100); // Max 100 per page

    const songs = await SongModel.search('', page, limit);
    const total = await SongModel.getTotalCount();

    res.json({
      success: true,
      data: songs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get songs error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch songs' });
  }
});

// Get trending songs
router.get('/trending', validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100);

    const songs = await SongModel.getTrending(page, limit);

    res.json({
      success: true,
      data: songs,
    });
  } catch (err) {
    console.error('Get trending error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch trending songs' });
  }
});

// Get popular songs
router.get('/popular', validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100);

    const songs = await SongModel.getPopular(page, limit);

    res.json({
      success: true,
      data: songs,
    });
  } catch (err) {
    console.error('Get popular error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch popular songs' });
  }
});

// Get new songs
router.get('/new', validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100);

    const songs = await SongModel.getNew(page, limit);

    res.json({
      success: true,
      data: songs,
    });
  } catch (err) {
    console.error('Get new songs error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch new songs' });
  }
});

// Search songs
router.get('/search', validatePagination, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ success: false, error: 'Search query must be at least 2 characters' });
    }

    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100);

    const songs = await SongModel.search(q, page, limit);
    const total = await SongModel.getTotalCount();

    res.json({
      success: true,
      data: songs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// Get song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await SongModel.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, error: 'Song not found' });
    }

    // Increment play count (async)
    SongModel.incrementPlayCount(req.params.id);

    res.json({
      success: true,
      data: song,
    });
  } catch (err) {
    console.error('Get song error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch song' });
  }
});

// Get songs by artist
router.get('/artist/:artistId', validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100);

    const songs = await SongModel.findByArtist(req.params.artistId, page, limit);

    res.json({
      success: true,
      data: songs,
    });
  } catch (err) {
    console.error('Get artist songs error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch artist songs' });
  }
});

// Get songs by album
router.get('/album/:albumId', validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 50, 100);

    const songs = await SongModel.findByAlbum(req.params.albumId, page, limit);

    res.json({
      success: true,
      data: songs,
    });
  } catch (err) {
    console.error('Get album songs error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch album songs' });
  }
});

// Get songs by language
router.get('/language/:languageId', validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100);

    const songs = await SongModel.findByLanguage(req.params.languageId, page, limit);

    res.json({
      success: true,
      data: songs,
    });
  } catch (err) {
    console.error('Get language songs error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch songs by language' });
  }
});

// Get songs by genre
router.get('/genre/:genreId', validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100);

    const songs = await SongModel.findByGenre(req.params.genreId, page, limit);

    res.json({
      success: true,
      data: songs,
    });
  } catch (err) {
    console.error('Get genre songs error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch songs by genre' });
  }
});

export default router;
