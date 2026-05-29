const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middlewares/errorHandler.js');
const authRoutes = require('./modules/auth/auth.routes.js');
const userRoutes = require('./modules/users/users.routes.js');
const businessRoutes = require('./modules/businesses/businesses.routes.js');
const categoryRoutes = require('./modules/categories/categories.routes.js');
const reviewRoutes = require('./modules/reviews/reviews.routes.js');
const testEmailRoutes = require('./routes/testEmail.routes.js');
const aiRoutes = require('./modules/ai/ai.routes.js');
const ai1Routes = require('./modules/ai1/ai1.routes.js');
const ai2Routes = require('./modules/ai2/ai2.routes.js');

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'modules/ai2/uploads')));

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
app.use("/api/v1/test", testEmailRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/ai1", ai1Routes);
app.use("/api/v1/ai2", ai2Routes);

app.use(errorHandler);
module.exports = app;