const prisma = require('../../config/db.js');

// create review (pending)
const createReview = async (data) => {
  const { user_id, business_id, rating, content } = data;
  const business = await prisma.business.findUnique({
    where: { id: business_id },
    select: { id: true, status: true },
  });
  if (!business || business.status !== 'approved') {
    const error = new Error('Business is not available for reviews');
    error.statusCode = 404;
    throw error;
  }
  return await prisma.review.create({
    data: {
      rating,
      content,
      moderation_status: 'pending',
      user: { connect: { id: user_id } },
      business: { connect: { id: business_id } },
    },
  });
};

// get approved reviews
const getApprovedReviews = async (business_id) => {
  return await prisma.review.findMany({
    where: {
      business_id,
      moderation_status: 'approved',
    },
    include: { user: true, reply: true },
  });
};

// update status (moderation)
const updateReviewStatus = async (id, status) => {
  return await prisma.review.update({
    where: { id },
    data: { moderation_status: status },
  });
};

// calculate average rating
const getAverageRating = async (business_id) => {
  const result = await prisma.review.aggregate({
    where: {
      business_id,
      moderation_status: 'approved',
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return { average: result._avg.rating || 0, count: result._count.rating || 0 };
};

const upsertReply = async ({ reviewId, userId, message }) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { business: { select: { user_id: true } } },
  });
  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }
  if (review.business.user_id !== userId) {
    const error = new Error('Not authorized to reply to this review');
    error.statusCode = 403;
    throw error;
  }

  return prisma.reviewReply.upsert({
    where: { review_id: reviewId },
    create: { review_id: reviewId, user_id: userId, message },
    update: { message },
  });
};

module.exports = {
  createReview,
  getApprovedReviews,
  updateReviewStatus,
  getAverageRating,
  upsertReply,
};
