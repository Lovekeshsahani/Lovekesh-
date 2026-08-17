# Gana Bajao - Multi-language Music Streaming App

A modern, feature-rich music streaming application that supports multiple Indian languages and provides a seamless audio experience.

## Features

### 🎵 Core Features
- **Multi-Language Support**: Hindi, Punjabi, Tamil, Telugu, Bengali, English
- **Music Streaming**: Stream unlimited songs with high-quality audio
- **Search & Discovery**: Advanced search, trending, popular, and new releases
- **Favorites**: Save your favorite songs
- **Playlists**: Create and manage custom playlists
- **Music Player**: Modern UI with play controls, volume, shuffle, and repeat
- **User Profiles**: Personalized user profiles with preferences

### 🔐 Authentication
- Secure JWT-based authentication
- User signup and login
- Password hashing with bcrypt
- Token refresh mechanism

### 👑 Premium Features
- Ad-free listening
- Offline downloads
- Higher audio quality
- Priority playback

### 🎛️ Admin Panel
- Add/manage songs, artists, albums
- Language and genre management
- Advertisement management
- User statistics and analytics
- Admin activity logs

## Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL
- **Authentication**: JWT
- **API Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 18
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js (>=16.0.0)
- PostgreSQL
- npm or yarn

### Backend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your database
# Update .env with PostgreSQL credentials

# Run migrations (automatic on server start)
npm run dev
```

### Frontend Setup

```bash
# Navigate to client
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gana_bajao
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Songs
- `GET /api/songs` - Get all songs
- `GET /api/songs/trending` - Get trending songs
- `GET /api/songs/popular` - Get popular songs
- `GET /api/songs/new` - Get new releases
- `GET /api/songs/search?q=query` - Search songs
- `GET /api/songs/:id` - Get song details
- `GET /api/songs/artist/:artistId` - Get artist songs
- `GET /api/songs/album/:albumId` - Get album songs
- `GET /api/songs/language/:languageId` - Get songs by language
- `GET /api/songs/genre/:genreId` - Get songs by genre

### Favorites
- `POST /api/favorites/add` - Add to favorites
- `POST /api/favorites/remove` - Remove from favorites
- `GET /api/favorites` - Get user favorites
- `GET /api/favorites/check/:songId` - Check if favorited

### Playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists` - Get user playlists
- `GET /api/playlists/:id` - Get playlist details
- `GET /api/playlists/:id/songs` - Get playlist songs
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Admin
- `POST /api/admin/songs` - Add song (admin)
- `PUT /api/admin/songs/:id` - Update song (admin)
- `DELETE /api/admin/songs/:id` - Delete song (admin)
- `POST /api/admin/artists` - Add artist (admin)
- `POST /api/admin/albums` - Add album (admin)
- `GET /api/admin/languages` - Get languages (admin)
- `POST /api/admin/languages` - Add language (admin)
- `GET /api/admin/genres` - Get genres (admin)
- `POST /api/admin/genres` - Add genre (admin)
- `GET /api/admin/licenses` - Get licenses (admin)
- `POST /api/admin/licenses` - Add license (admin)
- `GET /api/admin/advertisements` - Get ads (admin)
- `POST /api/admin/advertisements` - Add ad (admin)
- `GET /api/admin/statistics` - Get statistics (admin)
- `GET /api/admin/logs` - Get admin logs (admin)

## Project Structure

```
.
├── server/
│   ├── config/           # Configuration files
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── migrations/       # Database migrations
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
├── src/
│   ├── pages/            # React pages
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── store/            # Zustand stores
│   ├── App.jsx           # Main app component
│   ��── main.jsx          # React entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── package.json          # Backend dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── index.html            # HTML template
```

## Running the Application

### Development

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production

```bash
# Backend
npm start

# Frontend
cd client
npm run build
npm run preview
```

## Database Schema

The application includes the following main tables:
- `users` - User accounts
- `songs` - Music tracks
- `artists` - Music artists
- `albums` - Music albums
- `playlists` - User playlists
- `favorites` - User favorites
- `languages` - Supported languages
- `genres` - Music genres
- `music_licenses` - Music licenses
- `advertisements` - Advertisements
- `admin_logs` - Admin activity logs

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Helmet for HTTP headers
- ✅ Rate limiting
- ✅ SQL injection prevention (parameterized queries)
- ✅ Admin role-based access control

## Performance Optimization

- Pagination support for all list endpoints
- Database indexing on frequently queried fields
- Efficient query design with JOINs
- Lazy loading in frontend
- CDN-ready static file serving

## Future Enhancements

- [ ] Social features (follow, share)
- [ ] Recommendation engine (AI/ML)
- [ ] Offline sync for downloaded songs
- [ ] Podcast support
- [ ] Collaborative playlists
- [ ] Live radio stations
- [ ] Lyrics display
- [ ] Audio equalizer
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)

## Contributing

Contributions are welcome! Please follow the code style and create a pull request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

## Author

Lovekesh Sahani

---

**Made with ❤️ for music lovers**
