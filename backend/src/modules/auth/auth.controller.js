const prisma = require("../../config/db.js");
const { hashPassword, comparePassword } = require("./auth.service.js");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../../utils/jwt.js");

// REGISTER
const register = async (req, res) => {
  const { email, password, role } = req.body;
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password_hash: hashed, role }
  });
  res.json(user);
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: "Invalid password" });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.json({ accessToken, refreshToken });
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

module.exports = { register, login, refreshToken };