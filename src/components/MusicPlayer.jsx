import React from 'react';
import { usePlayerStore } from '../store/index.js';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat2, Shuffle } from 'lucide-react';

export default function MusicPlayer() {
  const {
    isPlaying,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    queue,
    currentIndex,
  } = usePlayerStore();

  const currentSong = queue[currentIndex];
  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gray-900 border-t border-gray-700 px-4 py-4 fixed bottom-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="mb-4 cursor-pointer" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        seek(percent * duration);
      }}>
        <div className="bg-gray-700 h-1 rounded">
          <div className="bg-primary h-1 rounded" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Song info and controls */}
      <div className="flex items-center justify-between">
        {/* Left: Song info */}
        <div className="flex-1 min-w-0">
          {currentSong ? (
            <div>
              <p className="text-white text-sm font-semibold truncate">{currentSong.title}</p>
              <p className="text-gray-400 text-xs truncate">{currentSong.artist_name}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No song playing</p>
          )}
        </div>

        {/* Center: Controls */}
        <div className="flex items-center gap-4 mx-4">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full ${
              shuffle ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button onClick={previous} className="text-gray-400 hover:text-white p-2">
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="bg-primary hover:bg-accent text-black p-3 rounded-full transition"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current" />
            )}
          </button>

          <button onClick={next} className="text-gray-400 hover:text-white p-2">
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 rounded-full ${
              repeat > 0 ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Repeat2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Volume and time */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-700 rounded cursor-pointer"
            />
          </div>
          <span className="text-gray-400 text-xs min-w-max">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
