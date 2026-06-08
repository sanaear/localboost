const express = require('express');
const fs = require('fs');
const path = require('path');
const prisma = require('../../config/db.js');
const { protect, optionalProtect, authorize } = require('../../middlewares/authMiddleware.js');

const router = express.Router();

function canSeeNonPublic(req) {
  return req.user?.role === 'admin' || req.user?.role === 'merchant';
}

function publicStatusWhere(req) {
  if (canSeeNonPublic(req)) return {};
  return { status: 'approved' };
}

function searchVariants(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return [];
  const lower = normalized.toLowerCase();
  const variants = new Set([normalized]);
  const replacements = [
    ['cafe', 'café'],
    ['café', 'cafe'],
    ['fes', 'fès'],
    ['fès', 'fes'],
    ['restaurant', 'restaurante'],
    ['craft', 'artisanat'],
    ['artisan', 'artisanat'],
    ['hotel', 'riad'],
  ];
  for (const [from, to] of replacements) {
    if (lower.includes(from)) variants.add(lower.replaceAll(from, to));
  }
  return Array.from(variants);
}

router.get('/', optionalProtect, async (req, res) => {
  const where = {};
  if (req.query.status) {
    where.status = req.query.status;
  }
  Object.assign(where, publicStatusWhere(req));
  const businesses = await prisma.business.findMany({
    where,
    include: {
      category: true,
      regionRel: true,
      user: true,
    },
  });
  res.json(businesses);
});

// 🔍 SEARCH (Name / description)
router.get('/search', optionalProtect, async (req, res) => {
  const { q } = req.query;
  const query = typeof q === 'string' ? q.trim() : '';
  const terms = searchVariants(query);

  try {
    const businesses = await prisma.business.findMany({
      where: {
        ...publicStatusWhere(req),
        ...(terms.length > 0
          ? {
              OR: terms.flatMap((term) => [
                { name: { contains: term, mode: 'insensitive' } },
                { description: { contains: term, mode: 'insensitive' } },
                { city: { contains: term, mode: 'insensitive' } },
                { category: { name_en: { contains: term, mode: 'insensitive' } } },
                { category: { name_fr: { contains: term, mode: 'insensitive' } } },
                { category: { name_es: { contains: term, mode: 'insensitive' } } },
              ]),
            }
          : {}),
      },
      include: {
        category: true,
        regionRel: true,
        user: true,
      },
    });

    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🌍 GEO FILTER (Haversine)
router.get('/near', async (req, res) => {
  const { lat, lng, distance } = req.query;

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const distNum = parseFloat(distance);

  if (isNaN(latNum) || isNaN(lngNum) || isNaN(distNum)) {
    return res.status(400).json({ error: 'Invalid lat, lng, or distance parameters' });
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
      AND "status" = 'approved'
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

router.get('/mine', protect, authorize('merchant'), async (req, res) => {
  const businesses = await prisma.business.findMany({
    where: { user_id: req.user.id },
    include: {
      category: true,
      regionRel: true,
      user: true,
      reviews: {
        include: {
          user: true,
          reply: true,
        },
        orderBy: { created_at: 'desc' },
      },
    },
    orderBy: { updated_at: 'desc' },
  });

  res.json(businesses);
});

router.get('/:id', optionalProtect, async (req, res) => {
  const { id } = req.params;
  const business = await prisma.business.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      regionRel: true,
      user: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!business) {
    return res.status(404).json({ error: 'Business not found' });
  }
  const isOwner = req.user?.role === 'merchant' && business.user_id === req.user.id;
  if (business.status && business.status !== 'approved' && req.user?.role !== 'admin' && !isOwner) {
    return res.status(404).json({ error: 'Business not found' });
  }

  res.json(business);
});

router.post('/', protect, authorize('merchant'), async (req, res) => {
  const data = {
    user_id: req.user.id,
    name: req.body.name?.trim(),
    description:
      typeof req.body?.description === 'string' ? req.body.description.trim() : undefined,
    city: typeof req.body?.city === 'string' ? req.body.city.trim() : undefined,
    address: typeof req.body?.address === 'string' ? req.body.address.trim() : undefined,
    postal_code:
      typeof req.body?.postal_code === 'string' ? req.body.postal_code.trim() : undefined,
    phone: typeof req.body?.phone === 'string' ? req.body.phone.trim() : undefined,
    whatsapp: typeof req.body?.whatsapp === 'string' ? req.body.whatsapp.trim() : undefined,
    website: typeof req.body?.website === 'string' ? req.body.website.trim() : undefined,
    category_id: typeof req.body?.category_id === 'number' ? req.body.category_id : undefined,
    region_id: typeof req.body?.region_id === 'number' ? req.body.region_id : undefined,
    lat: typeof req.body?.lat === 'number' ? req.body.lat : undefined,
    lng: typeof req.body?.lng === 'number' ? req.body.lng : undefined,
    status: 'pending',
  };
  if (req.body?.opening_hours && typeof req.body.opening_hours === 'object') {
    data.opening_hours = req.body.opening_hours;
  }
  if (Array.isArray(req.body?.images)) {
    data.images = req.body.images
      .filter((value) => typeof value === 'string' && value.trim())
      .map((value) => value.trim())
      .slice(0, 20);
  }
  if (!data.name) return res.status(400).json({ message: 'Business name is required' });
  const business = await prisma.business.create({ data });
  res.status(201).json(business);
});

router.put('/:id', protect, authorize('merchant'), async (req, res) => {
  const businessId = Number(req.params.id);
  if (!Number.isFinite(businessId) || businessId <= 0) {
    return res.status(400).json({ message: 'Invalid business id' });
  }

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) return res.status(404).json({ message: 'Business not found' });
  if (business.user_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

  const data = {};

  if (typeof req.body?.name === 'string') data.name = req.body.name.trim();
  if (typeof req.body?.description === 'string') data.description = req.body.description.trim();
  if (typeof req.body?.city === 'string') data.city = req.body.city.trim();
  if (typeof req.body?.address === 'string') data.address = req.body.address.trim();
  if (typeof req.body?.postal_code === 'string') data.postal_code = req.body.postal_code.trim();
  if (typeof req.body?.phone === 'string') data.phone = req.body.phone.trim();
  if (typeof req.body?.whatsapp === 'string') data.whatsapp = req.body.whatsapp.trim();
  if (typeof req.body?.website === 'string') data.website = req.body.website.trim();

  if (req.body?.category_id === null) data.category_id = null;
  if (typeof req.body?.category_id === 'number') data.category_id = req.body.category_id;

  if (req.body?.region_id === null) data.region_id = null;
  if (typeof req.body?.region_id === 'number') data.region_id = req.body.region_id;

  if (typeof req.body?.lat === 'number') data.lat = req.body.lat;
  if (typeof req.body?.lng === 'number') data.lng = req.body.lng;

  if (req.body?.opening_hours === null) data.opening_hours = null;
  if (typeof req.body?.opening_hours === 'object' && req.body?.opening_hours) {
    data.opening_hours = req.body.opening_hours;
  }

  if (Array.isArray(req.body?.images)) {
    const normalized = req.body.images
      .filter((value) => typeof value === 'string' && value.trim())
      .map((value) => value.trim())
      .slice(0, 20);
    data.images = normalized;
  }

  const updated = await prisma.business.update({
    where: { id: businessId },
    data,
  });

  res.json(updated);
});

function ensureUploadsDir() {
  const uploadsDir = path.join(__dirname, '..', 'ai2', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  return uploadsDir;
}

function saveBase64ImageToUploads(base64Str) {
  if (typeof base64Str !== 'string' || !base64Str.startsWith('data:image/')) return null;
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return null;
  const ext = matches[1].split('/')[1] || 'png';
  const dataBuffer = Buffer.from(matches[2], 'base64');
  const fileName = `business_${Date.now()}_${Math.random().toString(16).slice(2)}.${ext}`;
  const filePath = path.join(ensureUploadsDir(), fileName);
  fs.writeFileSync(filePath, dataBuffer);
  return `/uploads/${fileName}`;
}

router.post('/:id/images', protect, authorize('merchant'), async (req, res) => {
  const businessId = Number(req.params.id);
  if (!Number.isFinite(businessId) || businessId <= 0) {
    return res.status(400).json({ message: 'Invalid business id' });
  }

  const images = Array.isArray(req.body?.images) ? req.body.images : [];
  const normalized = images
    .filter((value) => typeof value === 'string' && value.trim())
    .map((value) => value.trim())
    .slice(0, 10);

  const saved = normalized.map((value) => saveBase64ImageToUploads(value) ?? value).filter(Boolean);
  if (saved.length === 0) return res.status(400).json({ message: 'No images provided' });

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) return res.status(404).json({ message: 'Business not found' });
  if (business.user_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

  const updated = await prisma.business.update({
    where: { id: businessId },
    data: { images: { push: saved } },
  });
  res.json(updated);
});

router.put('/:id/images', protect, authorize('merchant'), async (req, res) => {
  const businessId = Number(req.params.id);
  if (!Number.isFinite(businessId) || businessId <= 0) {
    return res.status(400).json({ message: 'Invalid business id' });
  }

  const images = Array.isArray(req.body?.images) ? req.body.images : [];
  const normalized = images
    .filter((value) => typeof value === 'string' && value.trim())
    .map((value) => value.trim())
    .slice(0, 20);

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) return res.status(404).json({ message: 'Business not found' });
  if (business.user_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

  const updated = await prisma.business.update({
    where: { id: businessId },
    data: { images: normalized },
  });
  res.json(updated);
});

router.put('/:id/moderate', protect, authorize('admin'), async (req, res) => {
  const businessId = Number(req.params.id);
  if (!Number.isFinite(businessId) || businessId <= 0) {
    return res.status(400).json({ message: 'Invalid business id' });
  }
  const { status, reason, notes } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Use: approved, rejected' });
  }
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) return res.status(404).json({ message: 'Business not found' });
  const updated = await prisma.business.update({
    where: { id: businessId },
    data: { status, ...(notes ? { description: notes } : {}) },
  });
  res.json(updated);
});

router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
  const businessId = Number(req.params.id);
  if (!Number.isFinite(businessId) || businessId <= 0) {
    return res.status(400).json({ message: 'Invalid business id' });
  }
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
    return res
      .status(400)
      .json({ message: 'Invalid status. Use: pending, approved, rejected, suspended' });
  }
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) return res.status(404).json({ message: 'Business not found' });
  const updated = await prisma.business.update({
    where: { id: businessId },
    data: { status },
  });
  res.json(updated);
});

module.exports = router;
