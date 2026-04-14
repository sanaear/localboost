const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middlewares/errorHandler.js');
const authRoutes = require('./modules/auth/auth.routes.js');
const userRoutes = require('./modules/users/users.routes.js');
const businessRoutes = require('./modules/businesses/businesses.routes.js');
const categoryRoutes = require('./modules/categories/categories.routes.js');
const reviewRoutes = require('./modules/reviews/reviews.routes.js');

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/businesses", businessRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use(errorHandler);
module.exports = app;