import express from 'express';
import { PlaylistModel } from '../models/PlaylistModel.js';
import { verifyToken } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Create playlist
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Playlist name required' });
    }

    const playlist = await PlaylistModel.create(req.user.userId, name, description, isPublic);

    res.status(201).json({
      success: true,
      message: 'Playlist created',
      data: playlist,
    });
  } catch (err) {
    console.error('Create playlist error:', err);
    res.status(500).json({ success: false, error: 'Failed to create playlist' });
  }
});

// Get user playlists
router.get('/', verifyToken, validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 20, 100);

    const playlists = await PlaylistModel.getUserPlaylists(req.user.userId, page, limit);

    res.json({
      success: true,
      data: playlists,
    });
  } catch (err) {
    console.error('Get playlists error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch playlists' });
  }
});

// Get playlist details
router.get('/:id', async (req, res) => {
  try {
    const playlist = await PlaylistModel.getById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    res.json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    console.error('Get playlist error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch playlist' });
  }
});

// Get playlist songs
router.get('/:id/songs', validatePagination, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 50, 100);

    const songs = await PlaylistModel.getPlaylistSongs(req.params.id, page, limit);

    res.json({
      success: true,
      data: songs,
    });
  } catch (err) {
    console.error('Get playlist songs error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch playlist songs' });
  }
});

// Add song to playlist
router.post('/:id/songs', verifyToken, async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ success: false, error: 'Song ID required' });
    }

    // Verify user owns playlist
    const playlist = await PlaylistModel.getById(req.params.id);
    if (!playlist || playlist.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await PlaylistModel.addSong(req.params.id, songId);

    res.json({
      success: true,
      message: 'Song added to playlist',
    });
  } catch (err) {
    console.error('Add song to playlist error:', err);
    res.status(500).json({ success: false, error: 'Failed to add song to playlist' });
  }
});

// Remove song from playlist
router.delete('/:id/songs/:songId', verifyToken, async (req, res) => {
  try {
    // Verify user owns playlist
    const playlist = await PlaylistModel.getById(req.params.id);
    if (!playlist || playlist.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await PlaylistModel.removeSong(req.params.id, req.params.songId);

    res.json({
      success: true,
      message: 'Song removed from playlist',
    });
  } catch (err) {
    console.error('Remove song from playlist error:', err);
    res.status(500).json({ success: false, error: 'Failed to remove song from playlist' });
  }
});

// Update playlist
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Verify user owns playlist
    const playlist = await PlaylistModel.getById(req.params.id);
    if (!playlist || playlist.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const updatedPlaylist = await PlaylistModel.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Playlist updated',
      data: updatedPlaylist,
    });
  } catch (err) {
    console.error('Update playlist error:', err);
    res.status(500).json({ success: false, error: 'Failed to update playlist' });
  }
});

// Delete playlist
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Verify user owns playlist
    const playlist = await PlaylistModel.getById(req.params.id);
    if (!playlist || playlist.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await PlaylistModel.delete(req.params.id);

    res.json({
      success: true,
      message: 'Playlist deleted',
    });
  } catch (err) {
    console.error('Delete playlist error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete playlist' });
  }
});

export default router;
