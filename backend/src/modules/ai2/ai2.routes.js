const express = require('express');
const router = express.Router();
const {
  createProfile,
  getCategories,
  getCities,
  getProfiles,
  generateDescription,
} = require('./ai2.controller.js');

/**
 * @route  GET /api/v1/ai2/categories
 * @desc   Get all business categories
 */
router.get('/categories', getCategories);

/**
 * @route  GET /api/v1/ai2/cities
 * @desc   Get all Moroccan cities
 */
router.get('/cities', getCities);

/**
 * @route  GET /api/v1/ai2/profiles
 * @desc   Get all saved business profiles
 */
router.get('/profiles', getProfiles);

/**
 * @route  POST /api/v1/ai2/profile
 * @desc   Save a full business profile (3-step wizard data)
 */
router.post('/profile', createProfile);

/**
 * @route  POST /api/v1/ai2/generate-description
 * @desc   Generate AI descriptions in EN, FR, AR for a profile
 */
router.post('/generate-description', generateDescription);

module.exports = router;
