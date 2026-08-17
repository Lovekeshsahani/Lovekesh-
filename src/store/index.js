import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,

  signup: async (email, username, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        username,
        password,
        fullName,
      });
      const { user, token, refreshToken } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      set({ user, token, refreshToken, isLoading: false });
      return response.data;
    } catch (err) {
      const error = err.response?.data?.error || 'Signup failed';
      set({ error, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { user, token, refreshToken } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      set({ user, token, refreshToken, isLoading: false });
      return response.data;
    } catch (err) {
      const error = err.response?.data?.error || 'Login failed';
      set({ error, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ user: null, token: null, refreshToken: null });
  },

  getMe: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data.data, isLoading: false });
      return response.data.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  updateProfile: async (updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/auth/profile`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({ user: { ...state.user, ...response.data.data } }));
      return response.data.data;
    } catch (err) {
      throw err;
    }
  },
}));

export const useSongStore = create((set) => ({
  songs: [],
  trending: [],
  popular: [],
  new: [],
  currentSong: null,
  isLoading: false,
  error: null,

  fetchSongs: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/songs`, {
        params: { page, limit },
      });
      set({ songs: response.data.data, isLoading: false });
      return response.data.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchTrending: async (page = 1, limit = 20) => {
    try {
      const response = await axios.get(`${API_URL}/songs/trending`, {
        params: { page, limit },
      });
      set({ trending: response.data.data });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching trending:', err);
      throw err;
    }
  },

  fetchPopular: async (page = 1, limit = 20) => {
    try {
      const response = await axios.get(`${API_URL}/songs/popular`, {
        params: { page, limit },
      });
      set({ popular: response.data.data });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching popular:', err);
      throw err;
    }
  },

  fetchNew: async (page = 1, limit = 20) => {
    try {
      const response = await axios.get(`${API_URL}/songs/new`, {
        params: { page, limit },
      });
      set({ new: response.data.data });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching new:', err);
      throw err;
    }
  },

  searchSongs: async (query, page = 1, limit = 20) => {
    try {
      const response = await axios.get(`${API_URL}/songs/search`, {
        params: { q: query, page, limit },
      });
      return response.data.data;
    } catch (err) {
      console.error('Error searching songs:', err);
      throw err;
    }
  },

  setSong: (song) => set({ currentSong: song }),
}));

export const useFavoriteStore = create((set) => ({
  favorites: [],
  isLoading: false,

  fetchFavorites: async (page = 1, limit = 20) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/favorites`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ favorites: response.data.data, isLoading: false });
      return response.data.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  addFavorite: async (songId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/favorites/add`,
        { songId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      throw err;
    }
  },

  removeFavorite: async (songId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/favorites/remove`,
        { songId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      throw err;
    }
  },
}));

export const usePlayerStore = create((set, get) => ({
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  currentTime: 0,
  duration: 0,
  volume: 1,
  shuffle: false,
  repeat: 0, // 0: no repeat, 1: repeat all, 2: repeat one
  audioElement: null,

  setQueue: (queue, startIndex = 0) => {
    set({ queue, currentIndex: startIndex });
  },

  play: () => {
    const state = get();
    if (state.audioElement && state.queue.length > 0) {
      state.audioElement.play();
      set({ isPlaying: true });
    }
  },

  pause: () => {
    const state = get();
    if (state.audioElement) {
      state.audioElement.pause();
      set({ isPlaying: false });
    }
  },

  togglePlay: () => {
    const state = get();
    if (state.isPlaying) {
      state.pause();
    } else {
      state.play();
    }
  },

  next: () => {
    const state = get();
    if (state.currentIndex < state.queue.length - 1) {
      set({ currentIndex: state.currentIndex + 1 });
      state.play();
    }
  },

  previous: () => {
    const state = get();
    if (state.currentIndex > 0) {
      set({ currentIndex: state.currentIndex - 1 });
      state.play();
    }
  },

  seek: (time) => {
    const state = get();
    if (state.audioElement) {
      state.audioElement.currentTime = time;
      set({ currentTime: time });
    }
  },

  setVolume: (volume) => {
    const state = get();
    if (state.audioElement) {
      state.audioElement.volume = volume;
      set({ volume });
    }
  },

  toggleShuffle: () => {
    set((state) => ({ shuffle: !state.shuffle }));
  },

  toggleRepeat: () => {
    set((state) => ({ repeat: (state.repeat + 1) % 3 }));
  },

  updateTime: (time) => set({ currentTime: time }),
  updateDuration: (duration) => set({ duration }),
  setAudioElement: (audio) => set({ audioElement: audio }),
}));

export const usePlaylistStore = create((set) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,

  fetchPlaylists: async (page = 1, limit = 20) => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/playlists`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ playlists: response.data.data, isLoading: false });
      return response.data.data;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  createPlaylist: async (name, description, isPublic) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/playlists`,
        { name, description, isPublic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({ playlists: [...state.playlists, response.data.data] }));
      return response.data.data;
    } catch (err) {
      throw err;
    }
  },

  addSongToPlaylist: async (playlistId, songId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/playlists/${playlistId}/songs`,
        { songId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      throw err;
    }
  },

  removeFromPlaylist: async (playlistId, songId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/playlists/${playlistId}/songs/${songId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      throw err;
    }
  },
}));
