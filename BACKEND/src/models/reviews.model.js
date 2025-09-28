import { pool } from "../config/db.js";

// Create a review
export const createReview = async (transaction_id, reviewer_id, reviewee_id, rating, comment) => {
  const query = `
    INSERT INTO Reviews (transaction_id, reviewer_id, reviewee_id, rating, comment)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [transaction_id, reviewer_id, reviewee_id, rating, comment];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Get all reviews for a specific user
export const getUserReviews = async (userId) => {
  const query = `
    SELECT r.*, u.full_name AS reviewer_name
    FROM Reviews r
    JOIN Users u ON r.reviewer_id = u.id
    WHERE r.reviewee_id = $1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

// Update a review
export const updateReview = async (reviewId, rating, comment) => {
  const query = `
    UPDATE Reviews
    SET rating = $1, comment = $2
    WHERE id = $3
    RETURNING *
  `;
  const { rows } = await pool.query(query, [rating, comment, reviewId]);
  return rows[0];
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const query = `DELETE FROM Reviews WHERE id = $1`;
  await pool.query(query, [reviewId]);
  return true;
};
