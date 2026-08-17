import React, { useEffect, useState } from 'react';
import { useSongStore } from '../store/index.js';
import { usePlayerStore } from '../store/index.js';
import { Play, Heart, Plus } from 'lucide-react';

const SongCard = ({ song }) => {
  const { setSong } = useSongStore();
  const { setQueue, currentIndex, play } = usePlayerStore();
  const [isFavorited, setIsFavorited] = useState(false);

  const handlePlayClick = () => {
    setSong(song);
    setQueue([song], 0);
    play();
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition group">
      <div className="relative">
        <img
          src={song.cover_url || 'https://via.placeholder.com/200'}
          alt={song.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handlePlayClick}
          className="absolute bottom-2 right-2 bg-primary hover:bg-accent text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          <Play className="w-6 h-6 fill-current" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{song.title}</h3>
        <p className="text-gray-400 text-sm truncate">{song.artist_name}</p>
        <div className="flex gap-2 mt-2">
          <button className="text-gray-400 hover:text-primary">
            <Heart className="w-4 h-4" />
          </button>
          <button className="text-gray-400 hover:text-primary">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
