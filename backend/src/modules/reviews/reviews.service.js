const prisma = require("../../config/db.js");

// create review (pending)
const createReview = async (data) => {
  return await prisma.review.create({
    data: {
      ...data,
      moderation_status: "pending"
    }
  });
};

// get approved reviews
const getApprovedReviews = async (business_id) => {
  return await prisma.review.findMany({
    where: {
      business_id,
      moderation_status: "approved"
    },
    include: { user: true, reply: true }
  });
};

// update status (moderation)
const updateReviewStatus = async (id, status) => {
  return await prisma.review.update({
    where: { id },
    data: { moderation_status: status }
  });
};

// calculate average rating
const getAverageRating = async (business_id) => {
  const result = await prisma.review.aggregate({
    where: {
      business_id,
      moderation_status: "approved"
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });

  return { average: result._avg.rating || 0, count: result._count.rating || 0 };
};

const upsertReply = async ({ reviewId, userId, message }) => {
  return prisma.reviewReply.upsert({
    where: { review_id: reviewId },
    create: { review_id: reviewId, user_id: userId, message },
    update: { message }
  });
};

module.exports = { createReview, getApprovedReviews, updateReviewStatus, getAverageRating, upsertReply };
