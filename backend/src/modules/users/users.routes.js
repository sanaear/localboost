const express = require('express');
const prisma = require('../../config/db.js');
const { protect, authorize } = require('../../middlewares/authMiddleware.js');
const { hashPassword } = require('../auth/auth.service.js');
const router = express.Router();

// GET all - Admin only, optional status filter
router.get('/', protect, authorize('admin'), async (req, res) => {
  const where = {};
  if (req.query.status) where.status = req.query.status;
  if (req.query.role) where.role = req.query.role;
  if (req.query.q) {
    const q = String(req.query.q);
    where.OR = [
      { email: { contains: q, mode: 'insensitive' } },
      { first_name: { contains: q, mode: 'insensitive' } },
      { last_name: { contains: q, mode: 'insensitive' } },
    ];
  }
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      role: true,
      email: true,
      first_name: true,
      last_name: true,
      status: true,
      preferred_lang: true,
      profile_image: true,
      phone: true,
      address: true,
      created_at: true,
    },
    orderBy: { created_at: 'desc' },
  });
  res.json(users);
});

// GET one - Protected, user can get their own, admin can get any
router.get('/:id', protect, async (req, res) => {
  const id = Number(req.params.id);
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      role: true,
      email: true,
      first_name: true,
      last_name: true,
      status: true,
      preferred_lang: true,
      profile_image: true,
      phone: true,
      address: true,
      created_at: true,
      updated_at: true,
    },
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// CREATE - Admin only
router.post('/', protect, authorize('admin'), async (req, res) => {
  const { email, password, role, first_name, last_name, preferred_lang, phone, address, profile_image } =
    req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'email is required' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: 'password is required' });
  }

  const normalizedRole = String(role || '').toLowerCase();
  const roleAliases = {
    user: 'tourist',
    business_owner: 'merchant',
    shopowner: 'merchant',
    shop_owner: 'merchant',
  };
  const storedRole = roleAliases[normalizedRole] ?? normalizedRole;
  if (!['admin', 'merchant', 'tourist'].includes(storedRole)) {
    return res.status(400).json({ message: 'Invalid role. Use: admin, merchant, tourist' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email is already registered' });

  const password_hash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password_hash,
      role: storedRole,
      status: 'active',
      first_name: typeof first_name === 'string' ? first_name : undefined,
      last_name: typeof last_name === 'string' ? last_name : undefined,
      preferred_lang: typeof preferred_lang === 'string' ? preferred_lang : undefined,
      phone: typeof phone === 'string' ? phone : undefined,
      address: typeof address === 'string' ? address : undefined,
      profile_image: typeof profile_image === 'string' ? profile_image : undefined,
    },
    select: {
      id: true,
      role: true,
      email: true,
      first_name: true,
      last_name: true,
      status: true,
      preferred_lang: true,
      profile_image: true,
      phone: true,
      address: true,
      created_at: true,
      updated_at: true,
    },
  });
  res.status(201).json(user);
});

// UPDATE - User can update their own, admin can update any
router.put('/:id', protect, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid user id' });
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const allowedFields = [
    'first_name',
    'last_name',
    'email',
    'phone',
    'address',
    'profile_image',
    'preferred_lang',
  ];
  const data = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  }

  if (req.body.status !== undefined) {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Only admins can change status' });
    if (!['active', 'suspended'].includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status. Use: active, suspended' });
    }
    data.status = req.body.status;
  }

  if (req.body.role !== undefined) {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Only admins can change role' });
    if (!['admin', 'merchant', 'tourist'].includes(req.body.role)) {
      return res.status(400).json({ message: 'Invalid role. Use: admin, merchant, tourist' });
    }
    data.role = req.body.role;
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      role: true,
      email: true,
      first_name: true,
      last_name: true,
      status: true,
      role: true,
      preferred_lang: true,
      profile_image: true,
      phone: true,
      address: true,
      created_at: true,
    },
  });
  res.json(user);
});

// DELETE - Admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ message: 'Deleted' });
});

module.exports = router;
