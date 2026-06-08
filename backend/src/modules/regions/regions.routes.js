const express = require('express');
const prisma = require('../../config/db.js');
const router = express.Router();

router.get('/', async (req, res) => {
  const regions = await prisma.region.findMany();
  res.json(regions);
});

module.exports = router;
