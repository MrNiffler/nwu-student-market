const validateReview = (req, res, next) => {
    const { rating, reviewer_id, reviewee_id, transaction_id } = req.body;

    // Only require IDs for POST
    if (req.method === "POST") {
        if (!transaction_id || !reviewer_id || !reviewee_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }
    }

    if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    next();
};

export default validateReview;