/* eslint-disable no-console */
require('dotenv').config();
const app = require('./app.js');

const PORT = process.env.PORT || 5000;

const { initDB } = require('./database/sqlite.js');

let server;
(async () => {
  try {
    // Initialize SQLite DB
    await initDB();

    server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to initialize database or start server:', err.message);
    process.exit(1);
  }
})();

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  }
});

// Prevent immediate exit
process.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Process exited with code ${code}`);
  }
});
