import React, { useState } from 'react';
import { useSongStore } from '../store/index.js';
import SongCard from '../components/SongCard.jsx';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const { searchSongs } = useSongStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.length < 2) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const searchResults = await searchSongs(query);
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen pb-32">
      {/* Search Bar */}
      <div className="bg-gray-900 p-8 mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for songs, artists, albums..."
              className="w-full bg-gray-800 text-white px-6 py-3 pl-12 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {isLoading && <p className="text-gray-400 text-center">Searching...</p>}

        {hasSearched && !isLoading && results.length === 0 && (
          <p className="text-gray-400 text-center">No results found for "{query}"</p>
        )}

        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Results for "{query}" ({results.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
