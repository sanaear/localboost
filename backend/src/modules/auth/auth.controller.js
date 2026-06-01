const prisma = require('../../config/db.js');
const { hashPassword, comparePassword } = require('./auth.service.js');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../../utils/jwt.js');

// REGISTER
const register = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'email, password, and role are required' });
  }
  const normalizedRole = String(role).toLowerCase();
  const roleAliases = {
    user: 'tourist',
    business_owner: 'merchant',
  };
  const storedRole = roleAliases[normalizedRole] ?? normalizedRole;
  if (!['tourist', 'merchant', 'admin'].includes(storedRole)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email is already registered' });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password_hash: hashed, role: storedRole },
    select: {
      id: true,
      email: true,
      role: true,
      preferred_lang: true,
      first_name: true,
      last_name: true,
      status: true,
      profile_image: true,
      phone: true,
      address: true,
      created_at: true,
      updated_at: true,
    },
  });
  res.json(user);
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.status === 'suspended') return res.status(403).json({ message: 'User is suspended' });
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: 'Invalid password' });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({ accessToken, refreshToken });
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

module.exports = { register, login, refreshToken };
