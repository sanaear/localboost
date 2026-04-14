const express = require("express");
const prisma = require("../../config/db.js");
const { protect } = require("../../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const businesses = await prisma.business.findMany({
    include: {
      category: true,
      user: true
    }
  });
  res.json(businesses);
});

// 🔍 SEARCH (Full-text)
router.get("/search", async (req, res) => {
  const { q } = req.query;

  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM businesses
      WHERE search_vector @@ to_tsquery(${q})
    `;

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🌍 GEO FILTER (Haversine)
router.get("/near", async (req, res) => {
  const { lat, lng, distance } = req.query;

  try {
    const result = await prisma.$queryRaw`
      SELECT *, (
        6371 * acos(
          cos(radians(${lat})) *
          cos(radians(lat)) *
          cos(radians(lng) - radians(${lng})) +
          sin(radians(${lat})) *
          sin(radians(lat))
        )
      ) AS distance
      FROM businesses
      HAVING distance < ${distance}
      ORDER BY distance;
    `;

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;