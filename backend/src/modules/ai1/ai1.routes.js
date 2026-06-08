const express = require('express');
const {
  generateStoryController,
  getDescriptionsController,
  rateDescriptionController,
} = require('./ai1.controller.js');

const router = express.Router();

/**
 * @route  POST /api/v1/ai1/generate
 * @desc   Generate a customized shop story with AI
 * @access Public
 */
router.post('/generate', generateStoryController);

/**
 * @route  GET /api/v1/ai1/descriptions
 * @desc   Get recently generated shop descriptions
 * @access Public
 */
router.get('/descriptions', getDescriptionsController);

/**
 * @route  POST /api/v1/ai1/descriptions/:id/rate
 * @desc   Rate a generated description
 * @access Public
 */
router.post('/descriptions/:id/rate', rateDescriptionController);

module.exports = router;
