import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export const UserModel = {
  async create(email, username, hashedPassword, fullName) {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO users (id, email, username, password_hash, full_name, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, email, username, full_name, is_premium, is_admin, created_at`,
      [id, email, username, hashedPassword, fullName]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_deleted = false',
      [email]
    );
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND is_deleted = false',
      [username]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT id, email, username, full_name, bio, is_premium, is_admin, language_preference, avatar_url, created_at FROM users WHERE id = $1 AND is_deleted = false',
      [id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const result = await pool.query(
      `UPDATE users SET
       full_name = COALESCE($1, full_name),
       bio = COALESCE($2, bio),
       language_preference = COALESCE($3, language_preference),
       avatar_url = COALESCE($4, avatar_url),
       updated_at = NOW()
       WHERE id = $5
       RETURNING id, email, username, full_name, bio, is_premium, language_preference, avatar_url`,
      [data.fullName, data.bio, data.languagePreference, data.avatarUrl, id]
    );
    return result.rows[0];
  },

  async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  },

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  },
};
