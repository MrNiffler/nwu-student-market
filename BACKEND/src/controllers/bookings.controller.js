import { pool } from "../config/db.js";

// Create booking
export async function createBooking(req, res) {
  try {
    const { listing_id, buyer_id, start_time, end_time } = req.body;
    const result = await pool.query(
      `INSERT INTO Bookings (listing_id, buyer_id, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, 'requested') RETURNING *`,
      [listing_id, buyer_id, start_time, end_time]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Read all bookings
export async function getAllBookings(_req, res) {
  try {
    const result = await pool.query("SELECT * FROM Bookings ORDER BY start_time DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Read bookings by user
export async function getBookingsByUser(req, res) {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT * FROM Bookings WHERE buyer_id = $1 ORDER BY start_time DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update booking status
export async function updateBookingStatus(req, res) {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE Bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Booking not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete booking
export async function deleteBooking(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM Bookings WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted successfully", booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
