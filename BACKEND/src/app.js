import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRouter from "./routes/health.route.js";
import bookingsRouter from "./routes/bookings.route.js";
import transactionsRouter from "./routes/transactions.route.js";
import ordersRouter from "./routes/orders.route.js";
import messageRoutes from "./routes/message.route.js";
import searchRouter from "./routes/search.route.js";
import listingsRouter from "./routes/listings.route.js";
import reviewsRouter from "./routes/reviews.route.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/health", healthRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/search", searchRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);

// Root route
app.get("/", (_req, res) => {
  res.json({ message: "NWU Student Market Backend running" });
});

export default app;
