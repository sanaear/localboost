const fs = require('fs');
const path = require('path');
const {
  CATEGORIES,
  CITIES,
  validateStep1,
  validateStep3,
  buildProfile,
} = require('./ai2.service.js');
const { generateStory } = require('../ai1/ai1.service.js');
const { run, all, get } = require('../../database/sqlite.js');

/**
 * GET /api/v1/ai2/categories
 */
const getCategories = (req, res) => {
  res.status(200).json({ success: true, data: CATEGORIES });
};

/**
 * GET /api/v1/ai2/cities
 */
const getCities = (req, res) => {
  res.status(200).json({ success: true, data: CITIES });
};

/**
 * POST /api/v1/ai2/profile
 * Body: { step1: {...}, step2: {...}, step3: {...} }
 */
const createProfile = async (req, res, next) => {
  try {
    const { step1, step2, step3 } = req.body;

    // ── Validate ──────────────────────────────────────────
    if (!step1) {
      return res.status(400).json({ success: false, message: 'Step 1 (business info) is required.' });
    }
    if (!step3) {
      return res.status(400).json({ success: false, message: 'Step 3 (hours & contact) is required.' });
    }

    const step1Errors = validateStep1(step1);
    if (step1Errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors: step1Errors });
    }

    const step3Errors = validateStep3(step3);
    if (step3Errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors: step3Errors });
    }

    // ── Save base64 images/logo to uploads folder ─────────────────
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Logo processing
    let logoPath = null;
    if (step2?.logo && typeof step2.logo === 'string' && step2.logo.startsWith('data:image/')) {
      const matches = step2.logo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || 'png';
        const dataBuffer = Buffer.from(matches[2], 'base64');
        const fileName = `logo_${Date.now()}.${ext}`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, dataBuffer);
        logoPath = `/uploads/${fileName}`;
      }
    }

    // Photos processing
    const savedPhotos = [];
    if (step2 && Array.isArray(step2.photos)) {
      step2.photos.forEach((base64Str, idx) => {
        if (typeof base64Str === 'string' && base64Str.startsWith('data:image/')) {
          const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const ext = matches[1].split('/')[1] || 'png';
            const dataBuffer = Buffer.from(matches[2], 'base64');
            const fileName = `captured_photo_${Date.now()}_${idx}.${ext}`;
            const filePath = path.join(uploadsDir, fileName);
            fs.writeFileSync(filePath, dataBuffer);
            savedPhotos.push(`/uploads/${fileName}`);
          }
        } else {
          savedPhotos.push(base64Str);
        }
      });
    }

    // ── Build & Save ──────────────────────────────────────
    const profile = buildProfile({
      step1,
      step2: { photos: savedPhotos, logoPath },
      step3,
    });

    // Save to SQLite
    const result = await run(
      `INSERT INTO ai2_profiles (
        name, category, city, address, phone, email, logo_path, tagline, social_links, photos, opening_hours, special_offers, whatsapp, website
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.businessName,
        profile.category,
        profile.city,
        profile.address,
        profile.phoneNumber,
        profile.email,
        profile.logoPath,
        profile.tagline,
        JSON.stringify(profile.socialLinks),
        JSON.stringify(profile.photos),
        JSON.stringify(profile.openingHours),
        profile.specialOffers,
        profile.whatsapp,
        profile.website
      ]
    );

    profile.id = result.id;

    return res.status(201).json({
      success: true,
      message: 'Business profile created successfully!',
      data: profile,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/ai2/profiles
 */
const getProfiles = async (req, res, next) => {
  try {
    const rows = await all(`SELECT * FROM ai2_profiles ORDER BY created_at DESC`);
    const parsedRows = rows.map(r => ({
      id: r.id,
      businessName: r.name,
      category: r.category,
      city: r.city,
      address: r.address,
      phoneNumber: r.phone,
      email: r.email,
      logoPath: r.logo_path,
      tagline: r.tagline,
      socialLinks: r.social_links ? JSON.parse(r.social_links) : [],
      photos: r.photos ? JSON.parse(r.photos) : [],
      openingHours: r.opening_hours ? JSON.parse(r.opening_hours) : {},
      specialOffers: r.special_offers,
      whatsapp: r.whatsapp,
      website: r.website,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));

    res.status(200).json({ success: true, data: parsedRows });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/ai2/generate-description
 * Body: { profileId, businessType, specialties, usps, tone, audience, tags }
 * Generates descriptions in EN, FR, AR using AI1 engine and stores them
 */
const generateDescription = async (req, res, next) => {
  try {
    const { profileId, businessType, specialties = [], usps, tone = 'storytelling', audience, tags = [] } = req.body;

    if (!profileId) {
      return res.status(400).json({ success: false, message: 'profileId is required.' });
    }

    // Check profile exists
    const profile = await get(`SELECT * FROM ai2_profiles WHERE id = ?`, [profileId]);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    // Generate descriptions in all 3 languages
    const descriptions = {};
    const languages = ['EN', 'FR', 'AR'];

    for (const lang of languages) {
      descriptions[lang] = generateStory({
        businessType: businessType || profile.name,
        specialties: specialties.length > 0 ? specialties : [profile.category],
        usps: usps || profile.tagline || 'great quality and service',
        language: lang,
        tone,
        audience: audience || 'tourists and visitors',
        tags: tags.length > 0 ? tags : [profile.category, profile.city].filter(Boolean),
        length: null,
        imageUrl: null
      });
    }

    // Store generated descriptions in the profile record
    await run(
      `UPDATE ai2_profiles SET generated_descriptions = ?, updated_at = datetime('now') WHERE id = ?`,
      [JSON.stringify(descriptions), profileId]
    );

    // Also save each description to ai1_descriptions table for history
    for (const lang of languages) {
      try {
        await run(
          `INSERT INTO ai1_descriptions (
            business_name, category, tone, language, tags, audience, description, length, image_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            businessType || profile.name,
            profile.category,
            tone,
            lang,
            JSON.stringify(tags.length > 0 ? tags : [profile.category, profile.city]),
            audience || 'tourists',
            descriptions[lang],
            descriptions[lang].split(/\s+/).length,
            null
          ]
        );
      } catch (dbErr) {
        console.error(`[SQLite Save AI1 ${lang} Error]`, dbErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Descriptions generated successfully in 3 languages!',
      data: {
        profileId: parseInt(profileId),
        descriptions,
        tone,
        wordCounts: {
          EN: descriptions.EN.split(/\s+/).length,
          FR: descriptions.FR.split(/\s+/).length,
          AR: descriptions.AR.split(/\s+/).length
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, getCities, createProfile, getProfiles, generateDescription };
