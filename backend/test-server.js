#!/usr/bin/env node

console.log('🔧 [1] Script starting...');

try {
  console.log('🔧 [2] Loading express...');
  const express = require('express');
  console.log('🔧 [3] Express loaded');

  console.log('🔧 [4] Creating app...');
  const app = express();
  app.use(express.json());
  
  console.log('🔧 [5] Adding test route...');
  app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
  });

  console.log('🔧 [6] Starting to listen...');
  const PORT = 5000;
  const server = app.listen(PORT, () => {
    console.log(`✅ [7] Server is listening on port ${PORT}`);
  });

  server.on('error', (err) => {
    console.error('❌ Server error:', err);
  });

  console.log('🔧 [8] Event listeners attached');
  
} catch (err) {
  console.error('❌ ERROR:', err.message);
  console.error('📍 Stack:', err.stack);
  process.exit(1);
}

console.log('🔧 [9] Test script execution complete, process should stay alive...');

setInterval(() => {}, 1000);
