import express from "express";
import {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransactionStatus,
  deleteTransaction
} from "../controllers/transactions.controller.js";

const router = express.Router();

router.get("/", getAllTransactions);
router.get("/:id", getTransaction);
router.post("/", createTransaction);
router.patch("/:id/status", updateTransactionStatus);
router.delete("/:id", deleteTransaction);

export default router;
