import React, { useEffect, useState } from 'react';
import { useFavoriteStore, usePlaylistStore } from '../store/index.js';
import SongCard from '../components/SongCard.jsx';
import { Music, Heart } from 'lucide-react';

export default function Library() {
  const { favorites, fetchFavorites, isLoading: favLoading } = useFavoriteStore();
  const { playlists, fetchPlaylists, createPlaylist, isLoading: playLoading } = usePlaylistStore();
  const [activeTab, setActiveTab] = useState('favorites');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchFavorites();
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      await createPlaylist(newPlaylistName, '', false);
      setNewPlaylistName('');
      setShowCreateForm(false);
      await fetchPlaylists();
    } catch (err) {
      console.error('Error creating playlist:', err);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen pb-32">
      <div className="bg-gray-900 p-8 mb-8">
        <h1 className="text-4xl font-bold text-white">Your Library</h1>
        <p className="text-gray-400 mt-2">Save and organize your favorite songs</p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-4 font-semibold transition ${
              activeTab === 'favorites'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            Favorites
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`pb-4 font-semibold transition ${
              activeTab === 'playlists'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Music className="w-5 h-5 inline mr-2" />
            Playlists
          </button>
        </div>

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            {favLoading && <p className="text-gray-400">Loading favorites...</p>}
            {!favLoading && favorites.length === 0 && (
              <p className="text-gray-400 text-center py-8">No favorites yet. Add some songs!</p>
            )}
            {favorites.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {favorites.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Playlists Tab */}
        {activeTab === 'playlists' && (
          <div>
            {/* Create Playlist Form */}
            {showCreateForm && (
              <form onSubmit={handleCreatePlaylist} className="bg-gray-800 p-4 rounded-lg mb-8">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name..."
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-accent text-black font-bold py-2 px-4 rounded transition"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="mb-8 bg-primary hover:bg-accent text-black font-bold py-2 px-6 rounded transition"
              >
                + Create Playlist
              </button>
            )}

            {/* Playlists List */}
            {playLoading && <p className="text-gray-400">Loading playlists...</p>}
            {!playLoading && playlists.length === 0 && (
              <p className="text-gray-400 text-center py-8">No playlists yet. Create one!</p>
            )}
            {playlists.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition cursor-pointer">
                    <Music className="w-16 h-16 text-primary mb-2" />
                    <h3 className="text-white font-semibold">{playlist.name}</h3>
                    <p className="text-gray-400 text-sm">{playlist.song_count} songs</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
