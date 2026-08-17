import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Insert languages
    const languages = [
      { code: 'hi', name: 'Hindi', native_name: 'हिन्दी' },
      { code: 'en', name: 'English', native_name: 'English' },
      { code: 'pa', name: 'Punjabi', native_name: 'ਪੰਜਾਬੀ' },
      { code: 'bh', name: 'Bhojpuri', native_name: 'भोजपुरी' },
      { code: 'bn', name: 'Bengali', native_name: 'বাংলা' },
      { code: 'mr', name: 'Marathi', native_name: 'मराठी' },
      { code: 'gu', name: 'Gujarati', native_name: 'ગુજરાતી' },
      { code: 'ta', name: 'Tamil', native_name: 'தமிழ்' },
      { code: 'te', name: 'Telugu', native_name: 'తెలుగు' },
      { code: 'kn', name: 'Kannada', native_name: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', native_name: 'മലയാളം' },
      { code: 'or', name: 'Odia', native_name: 'ଓଡିଆ' },
      { code: 'as', name: 'Assamese', native_name: 'অসমীয়া' },
      { code: 'ur', name: 'Urdu', native_name: 'اردو' },
      { code: 'ne', name: 'Nepali', native_name: 'नेपाली' },
    ];

    for (const lang of languages) {
      await pool.query(
        'INSERT INTO languages (code, name, native_name) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [lang.code, lang.name, lang.native_name]
      );
    }
    console.log('✅ Languages seeded');

    // Insert genres
    const genres = [
      { name: 'Bollywood', description: 'Hindi film music' },
      { name: 'Punjabi Pop', description: 'Punjabi popular music' },
      { name: 'Devotional', description: 'Religious and devotional music' },
      { name: 'Pop', description: 'Popular music' },
      { name: 'Hip Hop', description: 'Hip hop and rap music' },
      { name: 'Rock', description: 'Rock music' },
      { name: 'Electronic', description: 'Electronic and dance music' },
      { name: 'Classical', description: 'Classical music' },
      { name: 'Jazz', description: 'Jazz music' },
      { name: 'Folk', description: 'Folk and traditional music' },
      { name: 'Indie', description: 'Independent music' },
      { name: 'Remix', description: 'Remixed tracks' },
    ];

    for (const genre of genres) {
      await pool.query(
        'INSERT INTO genres (name, description) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [genre.name, genre.description]
      );
    }
    console.log('✅ Genres seeded');

    // Get language IDs for demo songs
    const hindiLang = await pool.query('SELECT id FROM languages WHERE code = $1', ['hi']);
    const hindiLangId = hindiLang.rows[0].id;

    const englishLang = await pool.query('SELECT id FROM languages WHERE code = $1', ['en']);
    const englishLangId = englishLang.rows[0].id;

    // Get genre IDs
    const bollywoodGenre = await pool.query('SELECT id FROM genres WHERE name = $1', ['Bollywood']);
    const bollywoodGenreId = bollywoodGenre.rows[0].id;

    // Insert demo artists
    const artistIds = [];
    const artists = [
      { name: 'Arijit Singh', bio: 'Indian singer and music producer' },
      { name: 'Badshah', bio: 'Indian hip hop artist' },
      { name: 'Neha Kakkar', bio: 'Indian playback singer' },
      { name: 'Dua Lipa', bio: 'British singer-songwriter' },
      { name: 'The Weeknd', bio: 'Canadian singer and producer' },
    ];

    for (const artist of artists) {
      const result = await pool.query(
        'INSERT INTO artists (name, bio, verified) VALUES ($1, $2, $3) RETURNING id',
        [artist.name, artist.bio, true]
      );
      artistIds.push(result.rows[0].id);
    }
    console.log('✅ Artists seeded');

    // Insert demo albums
    const albumIds = [];
    const albums = [
      { title: 'Ishq Ka Naam', artist_id: artistIds[0], release_date: '2023-01-15' },
      { title: 'Street Dreams', artist_id: artistIds[1], release_date: '2023-02-20' },
      { title: 'Best of Neha', artist_id: artistIds[2], release_date: '2023-03-10' },
    ];

    for (const album of albums) {
      const result = await pool.query(
        'INSERT INTO albums (title, artist_id, release_date) VALUES ($1, $2, $3) RETURNING id',
        [album.title, album.artist_id, album.release_date]
      );
      albumIds.push(result.rows[0].id);
    }
    console.log('✅ Albums seeded');

    // Insert demo songs (10 original demo songs + scalable structure)
    const demoDemoSongs = [
      {
        title: 'Tum Hi Ho',
        artist_id: artistIds[0],
        album_id: albumIds[0],
        duration: 216,
        language_id: hindiLangId,
        audio_url: 'https://example.com/songs/demo1.mp3',
        is_trending: true,
      },
      {
        title: 'Tera Ban Jaunga',
        artist_id: artistIds[0],
        album_id: albumIds[0],
        duration: 245,
        language_id: hindiLangId,
        audio_url: 'https://example.com/songs/demo2.mp3',
        is_popular: true,
      },
      {
        title: 'Raataan Lambiyan',
        artist_id: artistIds[2],
        album_id: albumIds[2],
        duration: 198,
        language_id: hindiLangId,
        audio_url: 'https://example.com/songs/demo3.mp3',
        is_new: true,
      },
      {
        title: 'Chaleya',
        artist_id: artistIds[0],
        album_id: albumIds[0],
        duration: 223,
        language_id: hindiLangId,
        audio_url: 'https://example.com/songs/demo4.mp3',
      },
      {
        title: 'Besharam Rang',
        artist_id: artistIds[1],
        album_id: albumIds[1],
        duration: 212,
        language_id: hindiLangId,
        audio_url: 'https://example.com/songs/demo5.mp3',
        is_trending: true,
      },
      {
        title: 'Aashiqui 2',
        artist_id: artistIds[2],
        album_id: albumIds[2],
        duration: 234,
        language_id: hindiLangId,
        audio_url: 'https://example.com/songs/demo6.mp3',
      },
      {
        title: 'Levitating',
        artist_id: artistIds[3],
        album_id: null,
        duration: 203,
        language_id: englishLangId,
        audio_url: 'https://example.com/songs/demo7.mp3',
        is_popular: true,
      },
      {
        title: 'Blinding Lights',
        artist_id: artistIds[4],
        album_id: null,
        duration: 200,
        language_id: englishLangId,
        audio_url: 'https://example.com/songs/demo8.mp3',
        is_popular: true,
      },
      {
        title: 'One Dance',
        artist_id: artistIds[4],
        album_id: null,
        duration: 216,
        language_id: englishLangId,
        audio_url: 'https://example.com/songs/demo9.mp3',
      },
      {
        title: 'Dynamite',
        artist_id: artistIds[0],
        album_id: albumIds[0],
        duration: 209,
        language_id: englishLangId,
        audio_url: 'https://example.com/songs/demo10.mp3',
      },
    ];

    for (const song of demoDemoSongs) {
      await pool.query(
        `INSERT INTO songs (title, artist_id, album_id, duration, language_id, audio_url, is_trending, is_popular, is_new)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          song.title,
          song.artist_id,
          song.album_id,
          song.duration,
          song.language_id,
          song.audio_url,
          song.is_trending || false,
          song.is_popular || false,
          song.is_new || false,
        ]
      );
    }
    console.log('✅ Demo songs seeded (10 demo songs)');
    console.log('✅ Database is scalable - no hard 10-song limit');

    // Insert demo ads
    await pool.query(
      `INSERT INTO advertisements (title, description, duration_seconds, frequency_after_songs, is_active)
       VALUES ($1, $2, $3, $4, $5)`,
      ['Premium Music Streaming', 'Get unlimited music with Gana Bajao Premium', 20, 3, true]
    );
    console.log('✅ Advertisement seeded');

    console.log('🎵 Database seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

export default seedDatabase;
