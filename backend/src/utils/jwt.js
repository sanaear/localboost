const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_SECRET || "access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken };
