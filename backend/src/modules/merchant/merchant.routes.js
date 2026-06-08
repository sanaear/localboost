const express = require('express');
const prisma = require('../../config/db.js');
const { protect, authorize } = require('../../middlewares/authMiddleware.js');

const router = express.Router();

function formatRelativeTime(date) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return '';

  const diffMs = Date.now() - value.getTime();
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

  return value.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

router.get('/updates', protect, authorize('merchant'), async (req, res) => {
  const businesses = await prisma.business.findMany({
    where: { user_id: req.user.id },
    select: { id: true, name: true, status: true, updated_at: true, images: true },
  });

  const businessIds = businesses.map((business) => business.id);
  if (businessIds.length === 0) {
    return res.json({ latest: [], older: [] });
  }

  const reviews = await prisma.review.findMany({
    where: { business_id: { in: businessIds }, moderation_status: 'approved' },
    orderBy: { created_at: 'desc' },
    take: 5,
    include: { user: true, business: true },
  });

  const latest = [];

  for (const review of reviews.slice(0, 2)) {
    const firstName = review.user?.first_name?.trim() || 'Someone';
    const lastInitial = review.user?.last_name?.trim()?.slice(0, 1);
    const author = lastInitial ? `${firstName} ${lastInitial}.` : firstName;

    latest.push({
      id: `review-${review.id}`,
      title: `New ${review.rating}-star review from ${author}`,
      time: formatRelativeTime(review.created_at),
      excerpt: review.content ? `"${review.content}"` : 'View review',
      accent: review.rating >= 5 ? 'gold' : 'gray',
    });
  }

  const approvedBusiness = businesses
    .filter((business) => String(business.status || '').toLowerCase() === 'approved')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  if (approvedBusiness) {
    latest.push({
      id: `profile-approved-${approvedBusiness.id}`,
      title: 'Your business profile has been approved',
      time: formatRelativeTime(approvedBusiness.updated_at),
      excerpt: 'Your shop is now visible to all tourists.',
      accent: 'green',
    });
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const views = await prisma.analyticsEvent.count({
    where: { business_id: { in: businessIds }, event_type: 'view', created_at: { gte: since } },
  });

  if (views > 0) {
    latest.push({
      id: 'views-spike',
      title: `Your profile was viewed ${views} time${views === 1 ? '' : 's'} this week`,
      time: formatRelativeTime(since),
      excerpt: 'View full report',
      accent: 'gray',
    });
  }

  const trimmedLatest = latest.slice(0, 3);

  const older = reviews.slice(2).map((review) => {
    const firstName = review.user?.first_name?.trim() || 'Someone';
    const lastInitial = review.user?.last_name?.trim()?.slice(0, 1);
    const author = lastInitial ? `${firstName} ${lastInitial}.` : firstName;

    return {
      id: `review-${review.id}`,
      title: `New ${review.rating}-star review from ${author}`,
      time: formatRelativeTime(review.created_at),
      accent: review.rating >= 5 ? 'gold' : 'gray',
    };
  });

  res.json({ latest: trimmedLatest, older });
});

router.get('/reviews', protect, authorize('merchant'), async (req, res) => {
  const businesses = await prisma.business.findMany({
    where: { user_id: req.user.id },
    select: { id: true, name: true },
  });
  const businessIds = businesses.map((business) => business.id);
  if (businessIds.length === 0) return res.json([]);

  const reviews = await prisma.review.findMany({
    where: {
      business_id: { in: businessIds },
      moderation_status: 'approved',
    },
    include: {
      user: true,
      business: { select: { id: true, name: true } },
      reply: true,
    },
    orderBy: { created_at: 'desc' },
  });

  res.json(reviews);
});

module.exports = router;
