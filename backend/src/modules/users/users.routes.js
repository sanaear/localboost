const express = require("express");
const prisma = require("../../config/db.js");
const { protect, authorize } = require("../../middlewares/authMiddleware.js");
const router = express.Router();

// GET all - Admin only
router.get("/", protect, authorize("admin"), async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// GET one - Protected, user can get their own, admin can get any
router.get("/:id", protect, async (req, res) => {
  const id = Number(req.params.id);
  if (req.user.role !== "admin" && req.user.id !== id) {
    return res.status(403).json({ message: "Not authorized" });
  }
  const user = await prisma.user.findUnique({
    where: { id }
  });
  res.json(user);
});

// CREATE - Admin only
router.post("/", protect, authorize("admin"), async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.json(user);
});

// UPDATE - User can update their own, admin can update any
router.put("/:id", protect, async (req, res) => {
  const id = Number(req.params.id);
  if (req.user.role !== "admin" && req.user.id !== id) {
    return res.status(403).json({ message: "Not authorized" });
  }
  const user = await prisma.user.update({
    where: { id },
    data: req.body
  });
  res.json(user);
});

// DELETE - Admin only
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  await prisma.user.delete({
    where: { id: Number(req.params.id) }
  });
  res.json({ message: "Deleted" });
});

module.exports = router;