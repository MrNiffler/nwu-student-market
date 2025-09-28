import express from "express";
import * as reviewsController from "../controllers/reviews.controller.js";
import validateReview from "../middleware/validateReview.js";

const router = express.Router();

// Create a review
router.post("/", validateReview, reviewsController.createReview);

// Get all reviews for a user
router.get("/users/:id", reviewsController.getUserReviews);

// Update a review
router.put("/:id", validateReview, reviewsController.updateReview);

// Delete a review
router.delete("/:id", reviewsController.deleteReview);

export default router;
