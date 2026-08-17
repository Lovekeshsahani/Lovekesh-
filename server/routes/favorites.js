import express from 'express';
import { FavoriteModel } from '../models/FavoriteModel.js';
import { verifyToken } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Add to favorites
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ success: false, error: 'Song ID required' });
    }

    await FavoriteModel.add(req.user.userId, songId);

    res.json({
      success: true,
      message: 'Added to favorites',
    });
  } catch (err) {
    console.error('Add favorite error:', err);
    res.status(500).json({ success: false, error: 'Failed to add favorite' });
  }
});

// Remove from favorites
router.post('/remove', verifyToken, async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ success: false, error: 'Song ID required' });
    }

    await FavoriteModel.remove(req.user.userId, songId);

    res.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (err) {
    console.error('Remove favorite error:', err);
    res.status(500).json({ success: false, error: 'Failed to remove favorite' });
  }
});

// Get user favorites
router.get('/', verifyToken, validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100);

    const favorites = await FavoriteModel.getUserFavorites(req.user.userId, page, limit);

    res.json({
      success: true,
      data: favorites,
    });
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch favorites' });
  }
});

// Check if song is favorited
router.get('/check/:songId', verifyToken, async (req, res) => {
  try {
    const isFavorited = await FavoriteModel.isFavorited(req.user.userId, req.params.songId);

    res.json({
      success: true,
      data: { isFavorited },
    });
  } catch (err) {
    console.error('Check favorite error:', err);
    res.status(500).json({ success: false, error: 'Failed to check favorite' });
  }
});

export default router;
