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

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Static file serving (from member2)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/health", healthRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/search", searchRouter);
app.use("/api", messageRoutes);
app.use("/api/listings", listingsRouter);

// Root route
app.get("/", (_req, res) => {
  res.json({ message: "NWU Student Market Backend running" });
});

export default app;
