const express = require('express');
const prisma = require('../../config/db.js');
const { protect } = require('../../middlewares/authMiddleware.js');

const router = express.Router();

function normalizeIds(value) {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))
  );
}

async function getVisibleBusinessIds(ids) {
  if (ids.length === 0) return [];
  const businesses = await prisma.business.findMany({
    where: { id: { in: ids }, status: 'approved' },
    select: { id: true },
  });
  return businesses.map((business) => business.id);
}

router.get('/', protect, async (req, res) => {
  const rows = await prisma.favorite.findMany({
    where: { user_id: req.user.id },
    select: { business_id: true },
  });
  res.json(rows.map((row) => row.business_id));
});

router.get('/business/:businessId/count', async (req, res) => {
  const businessId = Number(req.params.businessId);
  if (!Number.isFinite(businessId) || businessId <= 0) {
    return res.status(400).json({ message: 'Invalid businessId' });
  }
  const count = await prisma.favorite.count({ where: { business_id: businessId } });
  res.json({ count });
});

router.put('/', protect, async (req, res) => {
  const favorites = await getVisibleBusinessIds(normalizeIds(req.body?.favorites));
  await prisma.$transaction([
    prisma.favorite.deleteMany({ where: { user_id: req.user.id } }),
    ...(favorites.length > 0
      ? [
          prisma.favorite.createMany({
            data: favorites.map((businessId) => ({
              user_id: req.user.id,
              business_id: businessId,
            })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ]);
  res.json({ favorites });
});

router.post('/', protect, async (req, res) => {
  const businessId = Number(req.body?.businessId ?? req.body?.business_id);
  if (!Number.isFinite(businessId) || businessId <= 0) {
    return res.status(400).json({ message: 'Invalid businessId' });
  }
  const validIds = await getVisibleBusinessIds([businessId]);
  if (validIds.length === 0) {
    return res.status(404).json({ message: 'Business not found' });
  }

  await prisma.favorite.upsert({
    where: { user_id_business_id: { user_id: req.user.id, business_id: businessId } },
    create: { user_id: req.user.id, business_id: businessId },
    update: {},
  });

  const rows = await prisma.favorite.findMany({
    where: { user_id: req.user.id },
    select: { business_id: true },
  });
  res.json(rows.map((row) => row.business_id));
});

router.delete('/:businessId', protect, async (req, res) => {
  const businessId = Number(req.params.businessId);
  if (!Number.isFinite(businessId) || businessId <= 0) {
    return res.status(400).json({ message: 'Invalid businessId' });
  }

  await prisma.favorite.deleteMany({
    where: { user_id: req.user.id, business_id: businessId },
  });

  const rows = await prisma.favorite.findMany({
    where: { user_id: req.user.id },
    select: { business_id: true },
  });
  res.json(rows.map((row) => row.business_id));
});

module.exports = router;
