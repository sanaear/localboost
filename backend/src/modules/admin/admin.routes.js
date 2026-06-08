const express = require('express');
const prisma = require('../../config/db.js');
const { protect, authorize } = require('../../middlewares/authMiddleware.js');

const router = express.Router();

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function formatDayLabel(date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(date));
}

async function getStats() {
  const [totalBusinesses, pendingApprovals, activeUsers, flaggedReviews] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({ where: { status: 'pending' } }),
    prisma.user.count({ where: { role: { not: 'admin' } } }),
    prisma.review.count({ where: { moderation_status: 'flagged' } }),
  ]);

  return { totalBusinesses, pendingApprovals, activeUsers, flaggedReviews };
}

async function getActivities() {
  const [recentBusinesses, recentReviews, recentUsers] = await Promise.all([
    prisma.business.findMany({ orderBy: { updated_at: 'desc' }, take: 5, include: { user: true } }),
    prisma.review.findMany({
      orderBy: { created_at: 'desc' },
      take: 5,
      include: { user: true, business: true },
    }),
    prisma.user.findMany({ orderBy: { created_at: 'desc' }, take: 5 }),
  ]);

  const activities = [];
  for (const b of recentBusinesses) {
    activities.push({
      id: `biz-${b.id}`,
      type: 'business',
      action: b.status === 'pending' ? 'submitted' : 'updated',
      target: b.name,
      user: b.user?.email || 'unknown',
      time: b.updated_at,
    });
  }
  for (const r of recentReviews) {
    activities.push({
      id: `rev-${r.id}`,
      type: 'review',
      action: 'reviewed',
      target: r.business?.name || `Business #${r.business_id}`,
      user: r.user?.email || 'unknown',
      time: r.created_at,
    });
  }
  for (const u of recentUsers) {
    activities.push({
      id: `usr-${u.id}`,
      type: 'user',
      action: 'registered',
      target: u.email,
      user: u.email,
      time: u.created_at,
    });
  }
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  return activities.slice(0, 10);
}

async function getRegistrationTrends(days = 7) {
  const safeDays = Number.isFinite(days) && days > 0 ? Math.min(days, 30) : 7;
  const since = startOfDay(Date.now() - (safeDays - 1) * 24 * 60 * 60 * 1000);

  const users = await prisma.user.findMany({
    where: { created_at: { gte: since } },
    select: { created_at: true },
    orderBy: { created_at: 'asc' },
  });

  const countsByDay = new Map();
  for (let offset = 0; offset < safeDays; offset += 1) {
    const day = startOfDay(since.getTime() + offset * 24 * 60 * 60 * 1000);
    countsByDay.set(day.toISOString().slice(0, 10), {
      date: day.toISOString(),
      label: formatDayLabel(day),
      count: 0,
    });
  }

  for (const user of users) {
    const key = startOfDay(user.created_at).toISOString().slice(0, 10);
    const existing = countsByDay.get(key);
    if (existing) existing.count += 1;
  }

  return [...countsByDay.values()];
}

async function getBusinessesByCity() {
  const rows = await prisma.business.groupBy({
    by: ['city'],
    _count: { _all: true },
    orderBy: { _count: { city: 'desc' } },
    take: 5,
  });

  const max = Math.max(...rows.map((row) => row._count?._all || 0), 1);
  return rows.map((row) => {
    const count = row._count?._all || 0;
    return {
      name: row.city || 'Unknown',
      count,
      percentage: Math.round((count / max) * 100),
    };
  });
}

async function getExportSnapshot() {
  const [
    stats,
    users,
    businesses,
    categories,
    reviews,
    analyticsSummary,
    favoritesCount,
  ] = await Promise.all([
    getStats(),
    prisma.user.findMany({
      select: {
        id: true,
        role: true,
        email: true,
        first_name: true,
        last_name: true,
        status: true,
        preferred_lang: true,
        phone: true,
        address: true,
        profile_image: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { created_at: 'desc' },
    }),
    prisma.business.findMany({
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            role: true,
            status: true,
          },
        },
        _count: { select: { reviews: true, favorites: true, analytics_events: true } },
      },
      orderBy: { updated_at: 'desc' },
    }),
    prisma.category.findMany({
      include: { _count: { select: { businesses: true } } },
      orderBy: { id: 'asc' },
    }),
    prisma.review.findMany({
      include: {
        user: { select: { id: true, email: true, first_name: true, last_name: true } },
        business: { select: { id: true, name: true, city: true } },
        reply: true,
      },
      orderBy: { created_at: 'desc' },
    }),
    prisma.analyticsEvent.groupBy({ by: ['event_type'], _count: true }),
    prisma.favorite.count(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    stats,
    counts: {
      users: users.length,
      businesses: businesses.length,
      categories: categories.length,
      reviews: reviews.length,
      favorites: favoritesCount,
    },
    analyticsSummary: analyticsSummary.map((row) => ({
      event_type: row.event_type,
      count: row._count,
    })),
    users,
    businesses: businesses.map((business) => ({
      ...business,
      review_count: business._count?.reviews ?? 0,
      favorite_count: business._count?.favorites ?? 0,
      analytics_event_count: business._count?.analytics_events ?? 0,
      _count: undefined,
    })),
    categories: categories.map((category) => ({
      ...category,
      business_count: category._count?.businesses ?? 0,
      _count: undefined,
    })),
    reviews,
  };
}

router.get('/stats', protect, authorize('admin'), async (req, res) => {
  res.json(await getStats());
});

router.get('/activity', protect, authorize('admin'), async (req, res) => {
  res.json({ activities: await getActivities() });
});

router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  const [stats, activities, registrationTrends, businessesByCity] = await Promise.all([
    getStats(),
    getActivities(),
    getRegistrationTrends(7),
    getBusinessesByCity(),
  ]);

  res.json({
    stats,
    activities,
    registrationTrends,
    businessesByCity,
  });
});

router.get('/export', protect, authorize('admin'), async (req, res) => {
  const snapshot = await getExportSnapshot();
  const stamp = snapshot.exportedAt.replace(/[:.]/g, '-');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="localboost-export-${stamp}.json"`);
  res.json(snapshot);
});

module.exports = router;
