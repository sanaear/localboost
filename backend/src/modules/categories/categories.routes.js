const express = require("express");
const prisma = require("../../config/db.js");
const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

module.exports = router;