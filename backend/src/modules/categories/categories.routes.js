const express = require('express');
const prisma = require('../../config/db.js');
const { protect, authorize } = require('../../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const where = q
    ? {
        OR: [
          { name_en: { contains: q, mode: 'insensitive' } },
          { name_fr: { contains: q, mode: 'insensitive' } },
          { name_es: { contains: q, mode: 'insensitive' } },
          { name_ar: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {};
  const categories = await prisma.category.findMany({
    where,
    include: { _count: { select: { businesses: true } } },
    orderBy: { id: 'asc' },
  });
  res.json(
    categories.map((category) => ({
      ...category,
      business_count: category._count?.businesses ?? 0,
    }))
  );
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  const { name_en, name_fr, name_ar, name_es, icon } = req.body;
  if (!name_en && !name_fr && !name_ar && !name_es) {
    return res.status(400).json({ message: 'At least one language name is required' });
  }
  const category = await prisma.category.create({
    data: { name_en, name_fr, name_ar, name_es, icon },
  });
  res.status(201).json(category);
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ message: 'Invalid id' });
  const { name_en, name_fr, name_ar, name_es, icon } = req.body;
  const data = {};
  if (name_en !== undefined) data.name_en = name_en;
  if (name_fr !== undefined) data.name_fr = name_fr;
  if (name_ar !== undefined) data.name_ar = name_ar;
  if (name_es !== undefined) data.name_es = name_es;
  if (icon !== undefined) data.icon = icon;
  const category = await prisma.category.update({ where: { id }, data });
  res.json(category);
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ message: 'Invalid id' });
  await prisma.business.updateMany({ where: { category_id: id }, data: { category_id: null } });
  await prisma.category.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

router.post('/suggest', protect, async (req, res) => {
  const { name, description } = req.body;
  const categories = await prisma.category.findMany();
  const input = ((name || '') + ' ' + (description || '')).toLowerCase();
  const scored = categories.map((cat) => {
    const words = [cat.name_en, cat.name_fr, cat.name_ar, cat.name_es]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    let score = 0;
    const inputWords = input.split(/\s+/);
    for (const word of inputWords) {
      if (word.length > 2 && words.includes(word)) score += 1;
    }
    const catWords = words.split(/\s+/);
    for (const w of catWords) {
      if (w.length > 2 && input.includes(w)) score += 1;
    }
    return { ...cat, score };
  });
  scored.sort((a, b) => b.score - a.score);
  res.json(scored.slice(0, 5));
});

module.exports = router;
