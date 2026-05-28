const express = require("express");
const prisma = require("../../config/db.js");

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

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const distNum = parseFloat(distance);

  if (isNaN(latNum) || isNaN(lngNum) || isNaN(distNum)) {
    return res.status(400).json({ error: "Invalid lat, lng, or distance parameters" });
  }

  try {
    const result = await prisma.$queryRaw`
      SELECT *, (
        6371 * acos(
          cos(radians(${latNum})) *
          cos(radians("lat")) *
          cos(radians("lng") - radians(${lngNum})) +
          sin(radians(${latNum})) *
          sin(radians("lat"))
        )
      ) AS distance
      FROM public."Business"
      WHERE "lat" IS NOT NULL AND "lng" IS NOT NULL
      AND (
        6371 * acos(
          cos(radians(${latNum})) *
          cos(radians("lat")) *
          cos(radians("lng") - radians(${lngNum})) +
          sin(radians(${latNum})) *
          sin(radians("lat"))
        )
      ) < ${distNum}
      ORDER BY distance;
    `;

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const business = await prisma.business.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      user: true,
      reviews: {
        include: {
          user: true
        }
      }
    }
  });
  
  if (!business) {
    return res.status(404).json({ error: "Business not found" });
  }
  
  res.json(business);
});

module.exports = router;
