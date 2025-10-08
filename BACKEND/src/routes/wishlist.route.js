import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

// Add a listing to user's wishlist
router.post("/", addToWishlist);

// Remove a listing from user's wishlist
router.delete("/:listingId", removeFromWishlist);

// Get all wishlist items for a user
router.get("/:userId", getUserWishlist);

export default router;
