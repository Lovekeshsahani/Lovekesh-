import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/index.js';
import { LogOut, Mail, User as UserIcon, Globe, Edit2, Save } from 'lucide-react';

export default function Profile() {
  const { user, getMe, updateProfile, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    languagePreference: 'en',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getMe();
        if (userData) {
          setFormData({
            fullName: userData.full_name || '',
            bio: userData.bio || '',
            languagePreference: userData.language_preference || 'en',
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        fullName: formData.fullName,
        bio: formData.bio,
        languagePreference: formData.languagePreference,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen pb-32">
      <div className="bg-gradient-to-b from-primary to-gray-900 p-8 mb-8">
        <h1 className="text-4xl font-bold text-white">My Profile</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-8 mb-6">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-black" />
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Username</label>
              <p className="text-white text-lg font-semibold">{user.username}</p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <p className="text-white">{user.email}</p>
            </div>

            {user.is_premium && (
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-4 py-2 rounded-lg text-center font-semibold">
                ⭐ Premium Member
              </div>
            )}
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <div className="space-y-4 border-t border-gray-700 pt-6">
              <div>
                <label className="block text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Language Preference
                </label>
                <select
                  name="languagePreference"
                  value={formData.languagePreference}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="pa">Punjabi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="bn">Bengali</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-accent text-black font-bold py-2 px-4 rounded transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-700 pt-6">
              {formData.fullName && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-white">{formData.fullName}</p>
                </div>
              )}
              {formData.bio && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Bio</p>
                  <p className="text-white">{formData.bio}</p>
                </div>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-primary hover:bg-accent text-black font-bold py-2 px-4 rounded transition flex items-center justify-center gap-2 mt-4"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
