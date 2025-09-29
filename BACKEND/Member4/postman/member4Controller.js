// Node.js business logic for Ratings & Reviews
const member4Model = require("../models/member4Model");

// Create a review
exports.createReview = async (req, res) => {
    try {
        const { transaction_id, reviewer_id, reviewee_id, rating, comment } = req.body;
        const review = await member4Model.createReview(transaction_id, reviewer_id, reviewee_id, rating, comment);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all reviews for a user
exports.getUserReviews = async (req, res) => {
    try {
        const userId = req.params.id;
        const reviews = await member4Model.getUserReviews(userId);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { rating, comment } = req.body;
        const updated = await member4Model.updateReview(reviewId, rating, comment);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        await member4Model.deleteReview(reviewId);
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
