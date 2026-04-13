const express = require("express");
const prisma = require("../../config/db.js");
const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// GET one
router.get("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) }
  });
  res.json(user);
});

// CREATE
router.post("/", async (req, res) => {
  const user = await prisma.user.create({ data: req.body });
  res.json(user);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: req.body
  });
  res.json(user);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await prisma.user.delete({
    where: { id: Number(req.params.id) }
  });
  res.json({ message: "Deleted" });
});

module.exports = router;