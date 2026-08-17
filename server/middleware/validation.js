import { body, param, query, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// User validation rules
export const validateUserSignup = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('username').isLength({ min: 3 }),
  handleValidationErrors,
];

export const validateUserLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors,
];

// Song validation rules
export const validateSongCreate = [
  body('title').trim().notEmpty(),
  body('artistId').isUUID(),
  body('albumId').isUUID(),
  body('duration').isInt({ min: 1 }),
  body('languageId').isUUID(),
  body('genreIds').isArray(),
  body('allowOfflineDownload').isBoolean(),
  handleValidationErrors,
];

export const validateSongUpdate = [
  param('id').isUUID(),
  body('title').trim().optional(),
  body('duration').isInt({ min: 1 }).optional(),
  body('allowOfflineDownload').isBoolean().optional(),
  handleValidationErrors,
];

// Pagination validation
export const validatePagination = [
  query('page').isInt({ min: 1 }).optional().toInt(),
  query('limit').isInt({ min: 1, max: 100 }).optional().toInt(),
  handleValidationErrors,
];
