const reviewService = require("./reviews.service.js");

// CREATE
const create = async (req, res) => {
  const review = await reviewService.createReview(req.body);
  res.json(review);
};

// GET approved reviews
const getByBusiness = async (req, res) => {
  const data = await reviewService.getApprovedReviews(
    Number(req.params.business_id)
  );
  res.json(data);
};

// MODERATION (admin)
const moderate = async (req, res) => {
  const { status } = req.body; // approved / rejected
  const review = await reviewService.updateReviewStatus(
    Number(req.params.id),
    status
  );
  res.json(review);
};

// AVERAGE RATING
const average = async (req, res) => {
  const avg = await reviewService.getAverageRating(
    Number(req.params.business_id)
  );
  res.json({ average: avg });
};

module.exports = { create, getByBusiness, moderate, average };