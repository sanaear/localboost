const express = require('express');
const { sendReviewEmail } = require('../services/email.service.js');

const router = express.Router();

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { to, businessName, rating, content } = req.body;

    if (!to || !businessName || !rating || !content) {
      return res.status(400).json({
        error: 'Missing required fields: to, businessName, rating, content',
      });
    }

    await sendReviewEmail(to, {
      businessName,
      rating,
      content,
    });

    res.json({
      success: true,
      message: `Email sent successfully to ${to}`,
      data: {
        to,
        businessName,
        rating,
        content,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
});

module.exports = router;
