const express = require('express');
const prisma = require('../../config/db.js');
const controller = require('./reviews.controller.js');
const { protect, authorize } = require('../../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/', protect, authorize('admin'), async (req, res) => {
  const where = {};
  if (req.query.status) {
    where.moderation_status = req.query.status;
  }
  if (req.query.q) {
    const q = String(req.query.q);
    where.OR = [
      { content: { contains: q, mode: 'insensitive' } },
      { user: { email: { contains: q, mode: 'insensitive' } } },
      { user: { first_name: { contains: q, mode: 'insensitive' } } },
      { user: { last_name: { contains: q, mode: 'insensitive' } } },
      { business: { name: { contains: q, mode: 'insensitive' } } },
      { business: { city: { contains: q, mode: 'insensitive' } } },
    ];
  }
  const reviews = await prisma.review.findMany({
    where,
    include: {
      user: true,
      business: { include: { category: true } },
    },
    orderBy: { created_at: 'desc' },
  });
  res.json(reviews);
});

// create review (tourist)
router.post('/', protect, controller.create);

// get approved reviews
router.get('/business/:business_id', controller.getByBusiness);

// reply to review (merchant)
router.post('/:id/reply', protect, authorize('merchant'), controller.reply);

// average rating
router.get('/average/:business_id', controller.average);

// moderation (admin only)
router.put('/:id/moderate', protect, authorize('admin'), controller.moderate);
router.patch('/:id/status', protect, authorize('admin'), controller.moderate);

module.exports = router;
