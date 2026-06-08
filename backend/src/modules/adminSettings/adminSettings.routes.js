const express = require('express');
const fs = require('fs');
const path = require('path');
const { protect, authorize } = require('../../middlewares/authMiddleware.js');

const router = express.Router();
const SETTINGS_PATH = path.join(__dirname, 'settings.json');

const defaultSettings = {
  maintenanceMode: false,
  maxPhotosPerBusiness: 10,
  aiModerationThreshold: 0.7,
  aiSchedule: 'daily',
  twoFactorAuth: false,
  passwordRotationDays: 90,
  recentSessions: [],
  serverHealth: { status: 'healthy', uptimeSeconds: 0, memoryMb: 0, lastChecked: new Date().toISOString() },
};

function readSettings() {
  let fileSettings = {};
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      fileSettings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
    }
  } catch {
    /* ignore */
  }
  return { ...defaultSettings, ...fileSettings };
}

function writeSettings(data) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function normalizeSettingsPayload(body = {}) {
  const normalized = { ...body };
  if (normalized.maxPhotos !== undefined && normalized.maxPhotosPerBusiness === undefined) {
    normalized.maxPhotosPerBusiness = normalized.maxPhotos;
  }
  if (normalized.moderationThreshold !== undefined && normalized.aiModerationThreshold === undefined) {
    normalized.aiModerationThreshold = normalized.moderationThreshold;
  }
  if (normalized.passwordRotation !== undefined && normalized.passwordRotationDays === undefined) {
    normalized.passwordRotationDays = normalized.passwordRotation;
  }
  if (normalized.twoFactorEnabled !== undefined && normalized.twoFactorAuth === undefined) {
    normalized.twoFactorAuth = normalized.twoFactorEnabled;
  }

  delete normalized.maxPhotos;
  delete normalized.moderationThreshold;
  delete normalized.passwordRotation;
  delete normalized.twoFactorEnabled;

  return normalized;
}

function buildServerHealth() {
  const memory = process.memoryUsage();
  return {
    status: 'healthy',
    uptimeSeconds: Math.round(process.uptime()),
    memoryMb: Math.round(memory.rss / 1024 / 1024),
    heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
    lastChecked: new Date().toISOString(),
  };
}

function buildCurrentSession(req) {
  const userAgent = req.get('user-agent') || 'Current browser';
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  return {
    id: `current-${req.user.id}`,
    device: userAgent,
    ip,
    lastSeen: new Date().toISOString(),
    current: true,
  };
}

router.get('/', protect, authorize('admin'), (req, res) => {
  const settings = readSettings();
  res.json({
    ...settings,
    recentSessions: [buildCurrentSession(req), ...(settings.recentSessions || []).filter((session) => !session.current)],
    serverHealth: buildServerHealth(),
  });
});

router.put('/', protect, authorize('admin'), (req, res) => {
  const current = readSettings();
  const updated = { ...current, ...normalizeSettingsPayload(req.body) };
  writeSettings(updated);
  res.json({
    ...updated,
    recentSessions: [buildCurrentSession(req), ...(updated.recentSessions || []).filter((session) => !session.current)],
    serverHealth: buildServerHealth(),
  });
});

module.exports = router;
