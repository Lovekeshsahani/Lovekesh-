import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  // Create new user
  static async create(email, username, password, fullName = null) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = uuidv4();

      const result = await pool.query(
        `INSERT INTO users (id, email, username, password_hash, full_name, role)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, username, full_name, role, created_at`,
        [id, email, username, hashedPassword, fullName, 'user']
      );

      return result.rows[0];
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error finding user by email:', err);
      throw err;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, email, username, full_name, avatar_url, bio, is_premium, role, language_preference, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error finding user by ID:', err);
      throw err;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user profile
  static async updateProfile(id, updates) {
    try {
      const { fullName, bio, avatarUrl, languagePreference } = updates;
      const result = await pool.query(
        `UPDATE users SET full_name = COALESCE($2, full_name),
                         bio = COALESCE($3, bio),
                         avatar_url = COALESCE($4, avatar_url),
                         language_preference = COALESCE($5, language_preference),
                         updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, email, username, full_name, avatar_url, bio, language_preference`,
        [id, fullName, bio, avatarUrl, languagePreference]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  }

  // Upgrade to premium
  static async upgradeToPremium(id) {
    try {
      const result = await pool.query(
        'UPDATE users SET is_premium = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, is_premium',
        [id]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error upgrading to premium:', err);
      throw err;
    }
  }

  // Check if user is admin
  static async isAdmin(id) {
    try {
      const result = await pool.query('SELECT role FROM users WHERE id = $1', [id]);
      return result.rows[0]?.role === 'admin';
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  }

  // Get all users (admin only)
  static async getAll(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT id, email, username, full_name, is_premium, role, created_at FROM users
         ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  }
}
