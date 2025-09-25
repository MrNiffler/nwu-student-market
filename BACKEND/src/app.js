import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRouter from "./routes/health.route.js";
import bookingsRouter from "./routes/bookings.route.js";
import transactionsRouter from "./routes/transactions.route.js";
import ordersRouter from "./routes/orders.route.js";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/admin", adminRoutes);

// Routes
app.use("/api/health", healthRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/orders", ordersRouter);

// Root route
app.get("/", (_req, res) => {
  res.json({ message: "NWU Student Market Backend running" });
});

export default app;
