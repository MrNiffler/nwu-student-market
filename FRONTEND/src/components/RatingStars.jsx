import { useState } from "react";

function RatingStars({ listingId, userId, currentRating = 0, addNotification }) {
  const [rating, setRating] = useState(currentRating);
  const [hover, setHover] = useState(0);

  const handleSubmit = async (rate) => {
    try {
      const res = await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerId: userId,
          listingId,
          rating: rate,
          comment: "", // optional for now
        }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");

      setRating(rate);
      addNotification("Rating submitted successfully!", "success");
    } catch (err) {
      console.error(err);
      addNotification("Failed to submit rating", "error");
    }
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? "filled" : ""}`}
          onClick={() => handleSubmit(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingStars;
