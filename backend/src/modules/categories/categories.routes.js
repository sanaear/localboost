router.get("/", async (req, res) => {
  const data = await prisma.category.findMany();
  res.json(data);
});