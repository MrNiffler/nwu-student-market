// Node.js model functions (PostgreSQL queries)
const pool = require("../../db/pool"); // PostgreSQL connection pool

// Create review
exports.createReview = async (transaction_id, reviewer_id, reviewee_id, rating, comment) => {
    const query = `
        INSERT INTO reviews (transaction_id, reviewer_id, reviewee_id, rating, comment)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
    const values = [transaction_id, reviewer_id, reviewee_id, rating, comment];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

// Get all reviews for a user
exports.getUserReviews = async (userId) => {
    const query = `
        SELECT r.*, u.name AS reviewer_name
        FROM reviews r
        JOIN users u ON r.reviewer_id = u.id
        WHERE r.reviewee_id = $1`;
    const { rows } = await pool.query(query, [userId]);
    return rows;
};

// Update review
exports.updateReview = async (reviewId, rating, comment) => {
    const query = `
        UPDATE reviews
        SET rating = $1, comment = $2
        WHERE id = $3
        RETURNING *`;
    const { rows } = await pool.query(query, [rating, comment, reviewId]);
    return rows[0];
};

// Delete review
exports.deleteReview = async (reviewId) => {
    const query = `DELETE FROM reviews WHERE id = $1`;
    await pool.query(query, [reviewId]);
    return true;
};
