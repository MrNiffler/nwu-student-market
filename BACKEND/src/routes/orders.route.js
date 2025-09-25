import express from "express";
import { getUserOrderHistory } from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/user/:userId", getUserOrderHistory);

export default router;
