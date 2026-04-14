const express = require("express");
const prisma = require("../../config/db.js");

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

module.exports = router;