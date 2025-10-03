import express from "express";
import {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransactionStatus,
  deleteTransaction
} from "../controllers/transactions.controller.js";

const router = express.Router();

// Existing transaction routes
router.get("/", getAllTransactions);
router.get("/:id", getTransaction);
router.post("/", createTransaction);
router.patch("/:id/status", updateTransactionStatus);
router.delete("/:id", deleteTransaction);

// ✅ New PayFast payment route
router.post("/payfast", (req, res) => {
  const { items, user } = req.body;
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const paymentData = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    return_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
    notify_url: "https://your-server.com/notify",
    amount: total.toFixed(2),
    item_name: "NWU Marketplace Order",
    email_address: user.email,
  };

  const query = new URLSearchParams(paymentData).toString();
  res.json({ redirectUrl: `https://www.payfast.co.za/eng/process?${query}` });
});

export default router;
