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
    }
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
    }
  });

  return result._avg.rating || 0;
};

module.exports = { createReview, getApprovedReviews, updateReviewStatus, getAverageRating };