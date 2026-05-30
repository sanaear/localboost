const jwt = require("jsonwebtoken");
const ACCESS_SECRET = process.env.JWT_SECRET || "access_secret";

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };
};

module.exports = { protect, authorize };
