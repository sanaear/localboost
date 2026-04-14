const express = require("express");
const prisma = require("../../config/db.js");
const controller = require("./reviews.controller.js");
const { protect, authorize } = require("../../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      business: true
    }
  });
  res.json(reviews);
});

// create review (tourist)
router.post("/", protect, controller.create);

// get approved reviews
router.get("/business/:business_id", controller.getByBusiness);

// average rating
router.get("/average/:business_id", controller.average);

// moderation (admin only)
router.put("/:id/moderate", protect, authorize("admin"), controller.moderate);

module.exports = router;