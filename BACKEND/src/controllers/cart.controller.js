import { pool } from "../config/db.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { user_id, listing_id, quantity = 1 } = req.body;

    if (!user_id || !listing_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide user_id and listing_id",
      });
    }

    const query = `
      INSERT INTO Cart (user_id, listing_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, listing_id) 
      DO UPDATE SET quantity = Cart.quantity + EXCLUDED.quantity
      RETURNING *;
    `;
    const result = await pool.query(query, [user_id, listing_id, quantity]);

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Cart add error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { user_id } = req.body;

    const query = `
      DELETE FROM Cart 
      WHERE user_id = $1 AND listing_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [user_id, listingId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    res.json({ success: true, message: "Item removed from cart", data: result.rows[0] });
  } catch (err) {
    console.error("Cart remove error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update item quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { user_id, quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be >= 1" });
    }

    const query = `
      UPDATE Cart
      SET quantity = $3
      WHERE user_id = $1 AND listing_id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [user_id, listingId, quantity]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    res.json({ success: true, message: "Quantity updated", data: result.rows[0] });
  } catch (err) {
    console.error("Cart update error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user's cart
export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT C.id, C.listing_id, C.quantity, L.description, L.price, L.type
      FROM Cart C
      INNER JOIN Listings L ON C.listing_id = L.id
      WHERE C.user_id = $1
      ORDER BY C.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error("Get cart error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
