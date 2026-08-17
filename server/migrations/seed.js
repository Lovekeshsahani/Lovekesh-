import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const seedDatabase = async () => {
  try {
    // Add sample languages
    const languages = [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    ];

    for (const lang of languages) {
      await pool.query(
        'INSERT INTO languages (id, code, name, native_name) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [uuidv4(), lang.code, lang.name, lang.nativeName]
      );
    }

    console.log('✅ Database seeded with sample data');
  } catch (err) {
    console.error('⚠️ Error seeding database:', err.message);
  }
};

export default seedDatabase;
