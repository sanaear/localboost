const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '..', '..', 'localboost.db');

let db = null;

// Connect and initialize tables
function initDB() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Failed to open SQLite database:', err);
        return reject(err);
      }
      console.log('Connected to SQLite database at:', DB_PATH);

      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON;', (err) => {
        if (err) return reject(err);

        // Create tables synchronously or as promise chain
        createTables().then(resolve).catch(reject);
      });
    });
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. ai_chat table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS ai_chat (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          message TEXT NOT NULL,
          response TEXT NOT NULL,
          lang TEXT,
          tone TEXT,
          tags TEXT, -- JSON array of tags
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) return reject(err);
        }
      );

      // 2. ai1_descriptions table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS ai1_descriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          business_name TEXT NOT NULL,
          category TEXT,
          tone TEXT,
          language TEXT,
          tags TEXT, -- JSON array
          audience TEXT,
          description TEXT NOT NULL,
          length INTEGER,
          rating INTEGER DEFAULT NULL,
          image_url TEXT DEFAULT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) return reject(err);
        }
      );

      // 3. ai2_profiles table
      db.run(
        `
        CREATE TABLE IF NOT EXISTS ai2_profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT,
          city TEXT,
          address TEXT,
          phone TEXT,
          email TEXT,
          logo_path TEXT,
          tagline TEXT,
          social_links TEXT, -- JSON array
          photos TEXT, -- JSON array
          opening_hours TEXT, -- JSON object
          special_offers TEXT,
          whatsapp TEXT,
          website TEXT,
          generated_descriptions TEXT, -- JSON {EN, FR, AR}
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) return reject(err);

          // Add generated_descriptions column if upgrading existing DB
          db.run(`ALTER TABLE ai2_profiles ADD COLUMN generated_descriptions TEXT`, (alterErr) => {
            // Ignore error if column already exists
            resolve();
          });
        }
      );
    });
  });
}

// Helper methods to wrap db calls in Promises
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  initDB,
  run,
  get,
  all,
  getDbInstance: () => db,
};
