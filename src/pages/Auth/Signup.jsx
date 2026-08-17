import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/index.js';
import { Music } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: '',
  });
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await signup(formData.email, formData.username, formData.password, formData.fullName);
      navigate('/home');
    } catch (err) {
      setLocalError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Music className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-white">Gana Bajao</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="At least 8 characters"
              />
            </div>

            {(error || localError) && (
              <div className="bg-red-600 text-white p-3 rounded text-sm">{error || localError}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-accent text-black font-bold py-2 rounded transition disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-accent">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
