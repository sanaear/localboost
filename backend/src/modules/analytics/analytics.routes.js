const express = require("express");
const { Prisma } = require("@prisma/client");
const prisma = require("../../config/db.js");
const { protect, authorize } = require("../../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/event", async (req, res) => {
  const businessId = Number(req.body?.businessId ?? req.body?.business_id);
  const eventType = typeof req.body?.eventType === "string" ? req.body.eventType : typeof req.body?.event_type === "string" ? req.body.event_type : "";
  const metadata = req.body?.metadata ?? null;

  if (!Number.isFinite(businessId) || businessId <= 0) {
    return res.status(400).json({ message: "Invalid businessId" });
  }
  if (!eventType || typeof eventType !== "string") {
    return res.status(400).json({ message: "Invalid eventType" });
  }

  const created = await prisma.analyticsEvent.create({
    data: {
      business_id: businessId,
      event_type: eventType,
      metadata: metadata && typeof metadata === "object" ? metadata : null
    }
  });

  res.json({ success: true, data: created });
});

router.get("/merchant/summary", protect, authorize("merchant"), async (req, res) => {
  const days = req.query.days ? Number(req.query.days) : 30;
  const safeDays = Number.isFinite(days) && days > 0 ? Math.min(days, 180) : 30;

  const businesses = await prisma.business.findMany({
    where: { user_id: req.user.id },
    select: { id: true }
  });
  const businessIds = businesses.map((b) => b.id);
  if (businessIds.length === 0) {
    return res.json({
      success: true,
      data: {
        days: safeDays,
        totalViews: 0,
        totalClicks: 0,
        viewsByDay: [],
        clicksByDay: []
      }
    });
  }

  const since = new Date(Date.now() - safeDays * 24 * 60 * 60 * 1000);

  const [totalViews, totalClicks, viewsByDayRows, clicksByDayRows] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { business_id: { in: businessIds }, event_type: "view", created_at: { gte: since } }
    }),
    prisma.analyticsEvent.count({
      where: { business_id: { in: businessIds }, event_type: "click", created_at: { gte: since } }
    }),
    prisma.$queryRaw`
      SELECT date_trunc('day', "created_at") AS day, COUNT(*)::int AS count
      FROM public."AnalyticsEvent"
      WHERE "business_id" IN (${Prisma.join(businessIds)})
        AND "event_type" = 'view'
        AND "created_at" >= ${since}
      GROUP BY 1
      ORDER BY 1 ASC;
    `,
    prisma.$queryRaw`
      SELECT date_trunc('day', "created_at") AS day, COUNT(*)::int AS count
      FROM public."AnalyticsEvent"
      WHERE "business_id" IN (${Prisma.join(businessIds)})
        AND "event_type" = 'click'
        AND "created_at" >= ${since}
      GROUP BY 1
      ORDER BY 1 ASC;
    `
  ]);

  const viewsByBusiness = await prisma.$queryRaw`
    SELECT b."id" AS business_id, b."name" AS name, COUNT(*)::int AS count
    FROM public."AnalyticsEvent" a
    JOIN public."Business" b ON a."business_id" = b."id"
    WHERE a."business_id" IN (${Prisma.join(businessIds)})
      AND a."event_type" = 'view'
      AND a."created_at" >= ${since}
    GROUP BY b."id", b."name"
    ORDER BY count DESC
    LIMIT 4;
  `;

  res.json({
    success: true,
    data: {
      days: safeDays,
      totalViews,
      totalClicks,
      viewsByDay: viewsByDayRows,
      clicksByDay: clicksByDayRows,
      viewsByBusiness
    }
  });
});

module.exports = router;
