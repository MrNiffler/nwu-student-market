// Express middleware to validate incoming review requests
module.exports = (req, res, next) => {
    const { rating, reviewer_id, reviewee_id, transaction_id } = req.body;

    if (!transaction_id || !reviewer_id || !reviewee_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    next();
};
