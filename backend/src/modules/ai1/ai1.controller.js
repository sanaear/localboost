const { generateStory } = require('./ai1.service.js');
const { run, all, get } = require('../../database/sqlite.js');

/**
 * @route POST /api/v1/ai1/generate
 * @desc Generate a compelling shop story and store it in SQLite
 */
const generateStoryController = async (req, res, next) => {
  try {
    const {
      businessType,
      specialties = [],
      usps,
      language = 'EN',
      tone = 'storytelling',
      audience,
      tags = [],
      length,
      imageUrl,
    } = req.body;

    // Call service to generate story
    const story = generateStory({
      businessType,
      specialties,
      usps,
      language,
      tone,
      audience,
      tags,
      length: length ? parseInt(length) : null,
      imageUrl,
    });

    // Save to SQLite
    let savedId = null;
    try {
      const result = await run(
        `INSERT INTO ai1_descriptions (
          business_name, category, tone, language, tags, audience, description, length, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          businessType || 'Boutique',
          specialties.join(', '),
          tone,
          language,
          JSON.stringify(tags),
          audience || null,
          story,
          story.split(/\s+/).length,
          imageUrl || null,
        ]
      );
      savedId = result.id;
    } catch (dbErr) {
      console.error('[SQLite Save AI1 Error]', dbErr);
    }

    res.status(200).json({
      success: true,
      data: {
        id: savedId,
        text: story,
        length: story.length,
        wordCount: story.split(/\s+/).length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/v1/ai1/descriptions
 * @desc Get recently generated shop stories
 */
const getDescriptionsController = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const rows = await all(`SELECT * FROM ai1_descriptions ORDER BY created_at DESC LIMIT ?`, [
      limit,
    ]);
    const parsedRows = rows.map((r) => ({
      ...r,
      tags: r.tags ? JSON.parse(r.tags) : [],
    }));
    res.status(200).json({
      success: true,
      data: parsedRows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/v1/ai1/descriptions/:id/rate
 * @desc Update rating of a description (e.g. upvote/downvote or 1-5 stars)
 */
const rateDescriptionController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    if (rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    const row = await get(`SELECT id FROM ai1_descriptions WHERE id = ?`, [id]);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Description not found.' });
    }

    await run(`UPDATE ai1_descriptions SET rating = ? WHERE id = ?`, [parseInt(rating), id]);

    res.status(200).json({
      success: true,
      message: 'Description rated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateStoryController,
  getDescriptionsController,
  rateDescriptionController,
};
