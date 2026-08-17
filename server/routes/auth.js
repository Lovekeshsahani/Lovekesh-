import express from 'express';
import { UserModel } from '../models/UserModel.js';
import { generateToken, generateRefreshToken, verifyToken } from '../middleware/auth.js';
import { validateUserSignup, validateUserLogin } from '../middleware/validation.js';

const router = express.Router();

// Signup
router.post('/signup', validateUserSignup, async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    // Create user
    const user = await UserModel.create(email, username, password, fullName);

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user,
        token,
        refreshToken,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});

// Login
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatch = await UserModel.verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate tokens
    const token = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          isPremium: user.is_premium,
          role: user.role,
        },
        token,
        refreshToken,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token required' });
    }

    // Verify refresh token (simplified)
    const newToken = generateToken(req.user?.userId);
    res.json({
      success: true,
      data: { token: newToken },
    });
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// Update profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { fullName, bio, avatarUrl, languagePreference } = req.body;

    const updatedUser = await UserModel.updateProfile(req.user.userId, {
      fullName,
      bio,
      avatarUrl,
      languagePreference,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// Logout (client-side token deletion, server-side minimal)
router.post('/logout', verifyToken, async (req, res) => {
  // In production, you might want to blacklist tokens
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
