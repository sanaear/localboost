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

// 🔍 SEARCH (Name / description)
router.get("/search", async (req, res) => {
  const { q } = req.query;

  try {
    const businesses = await prisma.business.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } }
        ]
      },
      include: {
        category: true,
        user: true
      }
    });

    res.json(businesses);
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
          cos(radians("lat")) *
          cos(radians("lng") - radians(${lng})) +
          sin(radians(${lat})) *
          sin(radians("lat"))
        )
      ) AS distance
      FROM public."Business"
      WHERE "lat" IS NOT NULL AND "lng" IS NOT NULL
      AND (
        6371 * acos(
          cos(radians(${lat})) *
          cos(radians("lat")) *
          cos(radians("lng") - radians(${lng})) +
          sin(radians(${lat})) *
          sin(radians("lat"))
        )
      ) < ${distance}
      ORDER BY distance;
    `;

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;