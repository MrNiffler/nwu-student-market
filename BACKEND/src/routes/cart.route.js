import express from "express";
import {
  addToCart,
  removeFromCart,
  getUserCart,
  updateCartQuantity,
} from "../controllers/cart.controller.js";

const router = express.Router();

// Add item to cart
router.post("/", addToCart);

// Remove item from cart
router.delete("/:listingId", removeFromCart);

// Update quantity
router.patch("/:listingId", updateCartQuantity);

// Get user's cart
router.get("/:userId", getUserCart);

export default router;
