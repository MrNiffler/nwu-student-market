// Express.js routes for Member 4 (Ratings & Reviews)
const express = require("express");
const router = express.Router();
const member4Controller = require("../controllers/member4Controller");
const validateMember4 = require("../middleware/validateMember4");

// Create a new review
router.post("/ratings", validateMember4, member4Controller.createReview);

// Get all reviews for a specific user
router.get("/users/:id/reviews", member4Controller.getUserReviews);

// Update an existing review
router.put("/ratings/:id", validateMember4, member4Controller.updateReview);

// Delete a review
router.delete("/ratings/:id", member4Controller.deleteReview);

module.exports = router;
