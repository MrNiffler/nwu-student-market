import { pool } from "../config/db.js";

// Add a listing to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { user_id, listing_id } = req.body;

    if (!user_id || !listing_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide user_id and listing_id",
      });
    }

    const query = `
      INSERT INTO Wishlist (user_id, listing_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, listing_id) DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(query, [user_id, listing_id]);

    res.status(201).json({
      success: true,
      message: "Listing added to wishlist",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Wishlist add error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove a listing from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { user_id } = req.body;

    const query = `
      DELETE FROM Wishlist 
      WHERE user_id = $1 AND listing_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [user_id, listingId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found in wishlist",
      });
    }

    res.json({
      success: true,
      message: "Listing removed from wishlist",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Wishlist remove error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all wishlist items for a user
export const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT W.id, W.listing_id, L.description, L.price, L.type
      FROM Wishlist W
      INNER JOIN Listings L ON W.listing_id = L.id
      WHERE W.user_id = $1
      ORDER BY W.created_at DESC;
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("Get wishlist error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
