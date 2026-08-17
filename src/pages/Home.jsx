import React, { useEffect, useState } from 'react';
import { useSongStore, usePlayerStore } from '../store/index.js';
import SongCard from '../components/SongCard.jsx';
import { TrendingUp, Star, Zap } from 'lucide-react';

export default function Home() {
  const { fetchTrending, fetchPopular, fetchNew, trending, popular, new: newSongs } = useSongStore();
  const { setQueue, play } = usePlayerStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchTrending(), fetchPopular(), fetchNew()]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const playNow = (songs) => {
    if (songs.length > 0) {
      setQueue(songs, 0);
      play();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Loading music...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen pb-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary to-gray-900 p-8 mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to Gana Bajao</h1>
        <p className="text-gray-200">Discover and enjoy music in your favorite language</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Trending Section */}
        {trending.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trending.slice(0, 8).map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
            {trending.length > 8 && (
              <button
                onClick={() => playNow(trending)}
                className="mt-4 bg-primary hover:bg-accent text-black font-bold py-2 px-6 rounded transition"
              >
                Play All Trending
              </button>
            )}
          </section>
        )}

        {/* Popular Section */}
        {popular.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-white">Most Popular</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popular.slice(0, 8).map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </section>
        )}

        {/* New Releases Section */}
        {newSongs.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-white">New Releases</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newSongs.slice(0, 8).map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
