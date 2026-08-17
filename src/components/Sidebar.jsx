import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Music, User, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '../store/index.js';

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(true);

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`bg-gray-900 border-r border-gray-700 h-screen fixed top-0 left-0 z-40 transition-all ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 text-gray-400 hover:text-white w-full flex justify-center"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Logo */}
      {isOpen && (
        <div className="px-4 py-4 border-b border-gray-700">
          <Music className="w-8 h-8 text-primary inline mr-2" />
          <span className="text-white font-bold text-lg">Gana Bajao</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-8 space-y-2">
        <Link
          to="/home"
          className={`flex items-center gap-4 px-4 py-3 transition ${
            isActive('/home')
              ? 'bg-primary text-black'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Home className="w-6 h-6" />
          {isOpen && <span>Home</span>}
        </Link>

        <Link
          to="/search"
          className={`flex items-center gap-4 px-4 py-3 transition ${
            isActive('/search')
              ? 'bg-primary text-black'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Search className="w-6 h-6" />
          {isOpen && <span>Search</span>}
        </Link>

        <Link
          to="/library"
          className={`flex items-center gap-4 px-4 py-3 transition ${
            isActive('/library')
              ? 'bg-primary text-black'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Music className="w-6 h-6" />
          {isOpen && <span>Library</span>}
        </Link>

        <Link
          to="/profile"
          className={`flex items-center gap-4 px-4 py-3 transition ${
            isActive('/profile')
              ? 'bg-primary text-black'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <User className="w-6 h-6" />
          {isOpen && <span>Profile</span>}
        </Link>
      </nav>

      {/* Logout */}
      {isOpen && (
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
