import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import businessRoutes from "./modules/businesses/business.routes.js";

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

app.use(errorHandler);
export default app;