const { generateAIResponse, generateItinerary, fetchBusinesses } = require("./ai.service.js");
const { run, all } = require("../../database/sqlite.js");

// POST /api/v1/ai/chat
// body: { message, history?, lang?, tone?, tags? }
const chat = async (req, res, next) => {
  try {
    const { message, history = [], lang, tone = 'default', tags = [] } = req.body;
    if (!message || typeof message !== "string" || message.trim() === "")
      return res.status(400).json({ error: "Le message est requis." });
    if (message.length > 500)
      return res.status(400).json({ error: "Message trop long (max 500 caractères)." });

    const response = await generateAIResponse(message.trim(), history, { lang, tone, tags });

    // Save to SQLite db asynchronously
    try {
      await run(
        `INSERT INTO ai_chat (message, response, lang, tone, tags) VALUES (?, ?, ?, ?, ?)`,
        [message.trim(), response.text, response.lang, response.tone, JSON.stringify(tags)]
      );
    } catch (dbErr) {
      console.error("[SQLite Save Chat Error]", dbErr);
    }

    return res.json({ success: true, data: response });
  } catch (err) {
    console.error("[AI Chat Error]", err);
    return res.status(500).json({ error: "Erreur lors du traitement du message." });
  }
};

// GET /api/v1/ai/chat/history
const getChatHistory = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const history = await all(
      `SELECT * FROM ai_chat ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
    // Parse tags JSON
    const parsedHistory = history.map(h => ({
      ...h,
      tags: h.tags ? JSON.parse(h.tags) : []
    }));
    return res.json({ success: true, data: parsedHistory });
  } catch (err) {
    console.error("[SQLite Get Chat History Error]", err);
    return res.status(500).json({ error: "Erreur lors de la récupération de l'historique." });
  }
};

// POST /api/v1/ai/itinerary
// body: { city, lang?, preferences? }
const buildItinerary = async (req, res) => {
  try {
    const { city, lang = "fr", preferences = {} } = req.body;
    if (!city) return res.status(400).json({ error: "La ville est requise." });

    const itinerary = await generateItinerary(city, lang, preferences);
    return res.json({ success: true, data: itinerary });
  } catch (err) {
    console.error("[AI Itinerary Error]", err);
    return res.status(500).json({ error: "Erreur lors de la génération de l'itinéraire." });
  }
};

// GET /api/v1/ai/recommend?city=Fès&category=restaurant&lang=fr
const recommend = async (req, res) => {
  try {
    const { city, category, maxPrice } = req.query;
    const businesses = await fetchBusinesses({
      city: city || null,
      category: category || null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null
    });
    return res.json({ success: true, count: businesses.length, data: businesses });
  } catch (err) {
    console.error("[AI Recommend Error]", err);
    return res.status(500).json({ error: "Erreur lors des recommandations." });
  }
};

// GET /api/v1/ai/health
const health = async (req, res) => res.json({
  success: true,
  service: "LocalBoost AI",
  version: "2.0.0",
  languages: ["fr", "en", "ar", "es"],
  status: "operational",
  timestamp: new Date().toISOString()
});

module.exports = { chat, getChatHistory, buildItinerary, recommend, health };