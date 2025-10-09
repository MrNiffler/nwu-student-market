import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllListings } from "../api/endpoints";

// RatingStars component for reviews (reused from Marketplace)
function RatingStars({ listingId, currentRating = 0 }) {
  const [rating, setRating] = useState(currentRating);
  const [hover, setHover] = useState(0);

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? "filled" : ""}`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchListingsWithRatings = async () => {
      try {
        const res = await getAllListings();
        const listings = res.data.data.slice(0, 4);

        const listingsWithRatings = await Promise.all(
          listings.map(async (listing) => {
            try {
              const ratingRes = await fetch(
                `http://localhost:5000/api/reviews/users/${listing.id}`
              );
              if (!ratingRes.ok) throw new Error("No reviews available");

              const ratingData = await ratingRes.json();
              const avgRating =
                Array.isArray(ratingData) && ratingData.length > 0
                  ? ratingData.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingData.length
                  : 0;

              return { ...listing, avgRating };
            } catch {
              return { ...listing, avgRating: 0 };
            }
          })
        );

        setProducts(listingsWithRatings);
      } catch (err) {
        console.error("Failed to load listings:", err);
        setProducts([]);
      }
    };

    fetchListingsWithRatings();
  }, []);

  return (
    <div className="page-container">
      <section className="hero">
        <h2>Buy, sell and trade safely with fellow NWU students</h2>
        <p>Verified access, private messaging, and student-only listings.</p>
      </section>

      <section className="controls">
        <input className="search-bar" type="search" placeholder="Search listings (title, category)..." />
      </section>

      <section className="listings">
        <h3>Featured Listings</h3>
        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="card">
              <img src={product.image} alt={product.title} className="product-img" />
              <div className="card-content">
                <h4>{product.title}</h4>

                {/* Display average rating */}
                <RatingStars listingId={product.id} currentRating={product.avgRating || 0} />

                <p>{product.description}</p>
                <p className="price">R{product.price}</p>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <Link to="/marketplace" className="btn-primary">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
