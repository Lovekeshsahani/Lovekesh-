import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import { config } from '../config/environment.js';

// Verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token', details: err.message });
  }
};

// Verify admin role
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

// Verify premium user
export const isPremium = (req, res, next) => {
  if (!req.user || !req.user.isPremium) {
    return res.status(403).json({ success: false, error: 'Premium subscription required' });
  }
  next();
};

// Generate JWT token
export const generateToken = (userId, userRole = 'user') => {
  return jwt.sign(
    { userId, role: userRole },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

// Generate refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRE });
};
