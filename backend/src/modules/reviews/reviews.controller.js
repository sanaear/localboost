const reviewService = require('./reviews.service.js');

// CREATE
const create = async (req, res) => {
  const rating = Number(req.body.rating);
  const data = {
    user_id: req.user.id,
    business_id: Number(req.body.business_id),
    rating,
    content: typeof req.body.content === 'string' ? req.body.content.trim() : undefined,
  };
  if (!data.business_id || !data.rating) {
    return res.status(400).json({ message: 'business_id and rating are required' });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'rating must be an integer from 1 to 5' });
  }
  try {
    const review = await reviewService.createReview(data);
    res.json(review);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Failed to create review' });
  }
};

// GET approved reviews
const getByBusiness = async (req, res) => {
  const data = await reviewService.getApprovedReviews(Number(req.params.business_id));
  res.json(data);
};

// MODERATION (admin)
const moderate = async (req, res) => {
  const { status } = req.body; // approved / rejected
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Use: pending, approved, rejected' });
  }
  const review = await reviewService.updateReviewStatus(Number(req.params.id), status);
  res.json(review);
};

// AVERAGE RATING
const average = async (req, res) => {
  const avg = await reviewService.getAverageRating(Number(req.params.business_id));
  res.json(avg);
};

const reply = async (req, res) => {
  const reviewId = Number(req.params.id);
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!Number.isFinite(reviewId) || reviewId <= 0) {
    return res.status(400).json({ message: 'Invalid review id' });
  }
  if (!message) {
    return res.status(400).json({ message: 'Reply message is required' });
  }
  try {
    const result = await reviewService.upsertReply({ reviewId, userId: req.user.id, message });
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Failed to save reply' });
  }
};

module.exports = { create, getByBusiness, moderate, average, reply };
