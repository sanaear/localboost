require("dotenv").config();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function ensureCategory({ name_en, icon }) {
  const existing = await prisma.category.findFirst({ where: { name_en } });
  if (existing) return existing;
  return prisma.category.create({ data: { name_en, icon } });
}

async function ensureRegion({ name }) {
  const existing = await prisma.region.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.region.create({ data: { name } });
}

async function ensureUser({ email, password, role, first_name, last_name }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;
  const password_hash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password_hash,
      role,
      first_name,
      last_name,
      preferred_lang: "en",
    },
  });
}

async function main() {
  const categoryPottery = await ensureCategory({
    name_en: "Traditional Pottery Studio",
    icon: "ceramics",
  });
  const categoryDining = await ensureCategory({
    name_en: "Fine Dining",
    icon: "restaurant",
  });

  const regionFes = await ensureRegion({ name: "Fès-Meknès" });

  const merchant = await ensureUser({
    email: "merchant@localboost.dev",
    password: "merchant123",
    role: "merchant",
    first_name: "Yahya",
    last_name: "Merchant",
  });

  const tourist = await ensureUser({
    email: "tourist@localboost.dev",
    password: "tourist123",
    role: "tourist",
    first_name: "Emma",
    last_name: "Tourist",
  });

  let business = await prisma.business.findFirst({
    where: { user_id: merchant.id, name: "Atelier Poterie Fès" },
  });

  if (!business) {
    business = await prisma.business.create({
      data: {
        user_id: merchant.id,
        category_id: categoryPottery.id,
        region_id: regionFes.id,
        name: "Atelier Poterie Fès",
        city: "Fès",
        lat: 34.03313,
        lng: -5.00028,
        address: "Medina, Fès",
        postal_code: "30000",
        phone: "+212 600 000 000",
        whatsapp: "+212 600 000 000",
        website: "https://example.com",
        description:
          "Traditional pottery workshop in the heart of Fès. Handmade ceramics, guided tours, and live demonstrations.",
        images: [],
        status: "approved",
        opening_hours: {
          Monday: { open: true, hours: "09:00 - 18:00" },
          Tuesday: { open: true, hours: "09:00 - 18:00" },
          Wednesday: { open: true, hours: "09:00 - 18:00" },
          Thursday: { open: true, hours: "09:00 - 18:00" },
          Friday: { open: true, hours: "09:00 - 18:00" },
          Saturday: { open: true, hours: "10:00 - 16:00" },
          Sunday: { open: false, hours: "" },
        },
      },
    });
  }

  const existingReview = await prisma.review.findFirst({
    where: { business_id: business.id, user_id: tourist.id },
  });

  const review =
    existingReview ??
    (await prisma.review.create({
      data: {
        business_id: business.id,
        user_id: tourist.id,
        rating: 5,
        content: "Absolutely loved the pottery demonstration. Beautiful pieces and friendly staff.",
        moderation_status: "approved",
      },
    }));

  await prisma.favorite.upsert({
    where: { user_id_business_id: { user_id: tourist.id, business_id: business.id } },
    update: {},
    create: { user_id: tourist.id, business_id: business.id },
  });

  await prisma.analyticsEvent.createMany({
    data: [
      { business_id: business.id, event_type: "view" },
      { business_id: business.id, event_type: "view" },
      { business_id: business.id, event_type: "click" },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded:");
  console.log("- merchant login:", { email: merchant.email, password: "merchant123" });
  console.log("- tourist login:", { email: tourist.email, password: "tourist123" });
  console.log("- business:", { id: business.id, name: business.name });
  console.log("- review:", { id: review.id, rating: review.rating });
  console.log("- categories:", [categoryPottery.name_en, categoryDining.name_en]);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

