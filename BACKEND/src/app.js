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
import usersRouter from "./routes/user.js";   // any logged-in user
import adminRouter from "./routes/admin.js";  // admin-only
import wishlistRouter from "./routes/wishlist.route.js"; 
import cartRouter from "./routes/cart.route.js";         

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
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
app.use("/api/users", usersRouter);   // for /users/me
app.use("/api/admin", adminRouter);   // admin-only
app.use("/api/wishlist", wishlistRouter); 
app.use("/api/cart", cartRouter);

app.get("/", (_req, res) => {
  res.json({ message: "NWU Student Market Backend running" });
});

export default app;
