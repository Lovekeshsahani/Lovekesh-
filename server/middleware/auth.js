import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import { UserModel } from '../models/UserModel.js';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    }
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    if (!user || !user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Authorization failed',
    });
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRATION }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
    },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRATION }
  );
};
