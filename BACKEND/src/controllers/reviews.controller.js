import * as reviewsModel from "../models/reviews.model.js";

// Create a review
export const createReview = async (req, res) => {
    try {
        const { transaction_id, reviewer_id, reviewee_id, rating, comment } = req.body;
        const review = await reviewsModel.createReview(transaction_id, reviewer_id, reviewee_id, rating, comment);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all reviews for a user
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.params.id;
        const reviews = await reviewsModel.getUserReviews(userId);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const { rating, comment } = req.body;
        const updated = await reviewsModel.updateReview(reviewId, rating, comment);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        await reviewsModel.deleteReview(reviewId);
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
