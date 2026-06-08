const express = require('express');
const { chat, getChatHistory, buildItinerary, recommend, health } = require('./ai.controller.js');

const router = express.Router();

/**
 * @route  GET /api/v1/ai/health
 * @desc   Health check de la partie AI
 * @access Public
 */
router.get('/health', health);

/**
 * @route  GET /api/v1/ai/chat/history
 * @desc   Récupère l'historique récent du chatbot
 * @access Public
 */
router.get('/chat/history', getChatHistory);

/**
 * @route  POST /api/v1/ai/chat
 * @desc   Chatbot LocalBoost AI - répond aux questions en langage naturel
 * @body   { message: string, history?: array }
 * @access Public
 */
router.post('/chat', chat);

/**
 * @route  POST /api/v1/ai/itinerary
 * @desc   Génère un itinéraire personnalisé pour une ville
 * @body   { city: string, preferences?: { category, vegetarian, halal } }
 * @access Public
 */
router.post('/itinerary', buildItinerary);

/**
 * @route  GET /api/v1/ai/recommend
 * @desc   Recommandations filtrées (utilisé par le frontend Explore)
 * @query  city, category, maxPrice, vegetarian, halal
 * @access Public
 */
router.get('/recommend', recommend);

module.exports = router;
