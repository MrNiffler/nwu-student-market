// routes/listings.route.js
import express from "express";
import { pool } from "../config/db.js";
import upload from "../config/multer.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- GET all listings ---
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT L.id, L.type, L.description, L.price, L.status, L.created_at,
             U.full_name as seller_name, C.name as category_name
      FROM Listings L
      INNER JOIN Users U ON L.seller_id = U.id
      LEFT JOIN Categories C ON L.category_id = C.id
      WHERE L.status = 'active'
      ORDER BY L.created_at DESC;
    `;
    const result = await pool.query(query);

    const listings = result.rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.description.substring(0, 50) + (row.description.length > 50 ? "..." : ""),
      description: row.description,
      price: row.price,
      status: row.status,
      category: row.category_name,
      seller: row.seller_name,
      postedDate: row.created_at,
    }));

    res.json({ success: true, count: listings.length, data: listings });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ success: false, message: "Server Error: Could not retrieve listings." });
  }
});

// --- GET single listing by ID ---
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id) || parseInt(id) <= 0)
      return res.status(400).json({ success: false, message: "Invalid listing ID." });

    const query = `
      SELECT L.id, L.seller_id, L.category_id, L.type, L.description, L.price, L.status, L.created_at,
             U.full_name as seller_name, U.email as seller_email, U.student_number as seller_student_number,
             C.name as category_name,
             (SELECT COUNT(*) FROM reviews R WHERE R.reviewee_id = U.id) as seller_review_count
      FROM Listings L
      INNER JOIN Users U ON L.seller_id = U.id
      LEFT JOIN Categories C ON L.category_id = C.id
      WHERE L.id = $1;
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Listing not found." });

    const listing = result.rows[0];
    res.json({
      success: true,
      data: {
        id: listing.id,
        type: listing.type,
        description: listing.description,
        price: listing.price,
        status: listing.status,
        category: listing.category_name,
        postedDate: listing.created_at,
        seller: {
          id: listing.seller_id,
          name: listing.seller_name,
          email: listing.seller_email,
          studentNumber: listing.seller_student_number,
          reviewCount: listing.seller_review_count,
        },
      },
    });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ success: false, message: "Server Error: Could not retrieve the listing." });
  }
});

// --- POST create listing ---
router.post("/", async (req, res) => {
  try {
    const { category_id, type, description, price } = req.body;
    if (!category_id || !type || !description || !price)
      return res.status(400).json({ success: false, message: "Missing required fields." });

    if (!["product", "service"].includes(type))
      return res.status(400).json({ success: false, message: 'Type must be "product" or "service".' });

    const seller_id = 2; // placeholder
    const query = `
      INSERT INTO listings (seller_id, category_id, type, description, price, status)
      VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *;
    `;
    const result = await pool.query(query, [seller_id, category_id, type, description, price]);
    res.status(201).json({ success: true, message: "Listing created successfully", data: result.rows[0] });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ success: false, message: "Server Error: Could not create listing." });
  }
});

// --- PUT update listing ---
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, type, description, price, status } = req.body;

    if (isNaN(id) || parseInt(id) <= 0) return res.status(400).json({ success: false, message: "Invalid ID." });
    if (!category_id && !type && !description && !price && !status)
      return res.status(400).json({ success: false, message: "Provide at least one field to update." });

    if (type && !["product", "service"].includes(type))
      return res.status(400).json({ success: false, message: 'Type must be "product" or "service".' });

    if (status && !["active", "inactive"].includes(status))
      return res.status(400).json({ success: false, message: 'Status must be "active" or "inactive".' });

    const seller_id = 2;
    const ownershipCheck = await pool.query("SELECT id FROM listings WHERE id = $1 AND seller_id = $2", [id, seller_id]);
    if (ownershipCheck.rows.length === 0) return res.status(404).json({ success: false, message: "No permission." });

    const updateFields = [];
    const values = [];
    if (category_id) { updateFields.push(`category_id = $${values.length + 1}`); values.push(category_id); }
    if (type) { updateFields.push(`type = $${values.length + 1}`); values.push(type); }
    if (description) { updateFields.push(`description = $${values.length + 1}`); values.push(description); }
    if (price) { updateFields.push(`price = $${values.length + 1}`); values.push(price); }
    if (status) { updateFields.push(`status = $${values.length + 1}`); values.push(status); }
    values.push(id, seller_id);

    const query = `
      UPDATE listings
      SET ${updateFields.join(", ")}
      WHERE id = $${values.length - 1} AND seller_id = $${values.length}
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    res.json({ success: true, message: "Listing updated successfully", data: result.rows[0] });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ success: false, message: "Server Error: Could not update listing." });
  }
});

// --- DELETE (soft delete) listing ---
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id) || parseInt(id) <= 0) return res.status(400).json({ success: false, message: "Invalid ID." });

    const seller_id = 2;
    const ownershipCheck = await pool.query("SELECT id FROM listings WHERE id = $1 AND seller_id = $2", [id, seller_id]);
    if (ownershipCheck.rows.length === 0) return res.status(404).json({ success: false, message: "No permission." });

    const softDeleteQuery = `UPDATE listings SET status = 'inactive' WHERE id = $1 AND seller_id = $2 RETURNING *;`;
    const result = await pool.query(softDeleteQuery, [id, seller_id]);
    res.json({ success: true, message: "Listing deleted successfully", data: result.rows[0] });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ success: false, message: "Server Error: Could not delete listing." });
  }
});

// --- POST upload image for listing ---
router.post("/:id/images", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id) || parseInt(id) <= 0) return res.status(400).json({ success: false, message: "Invalid ID." });
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded." });

    const seller_id = 2;
    const ownershipCheck = await pool.query("SELECT id FROM listings WHERE id = $1 AND seller_id = $2", [id, seller_id]);
    if (ownershipCheck.rows.length === 0) return res.status(404).json({ success: false, message: "No permission." });

    // Cloudinary upload
    const result = await cloudinary.uploader.upload(req.file.path, { folder: `listings/${id}` });

    const altText = req.body.alt_text || `Image for listing ${id}`;
    const dbResult = await pool.query(
      "INSERT INTO listing_images (listing_id, url, alt_text, public_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, result.secure_url, altText, result.public_id]
    );

    res.status(201).json({ success: true, message: "Image uploaded successfully", data: dbResult.rows[0] });
  } catch (err) {
    console.error("Image upload error:", err.message);
    res.status(500).json({ success: false, message: "Server Error: Could not upload image." });
  }
});

// --- GET all images for a listing ---
router.get("/:id/images", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id) || parseInt(id) <= 0) return res.status(400).json({ success: false, message: "Invalid listing ID." });

    const result = await pool.query("SELECT id, listing_id, url, alt_text FROM listing_images WHERE listing_id = $1 ORDER BY id ASC", [id]);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ success: false, message: "Could not retrieve images." });
  }
});

// --- DELETE specific image ---
router.delete("/:id/images/:imageId", async (req, res) => {
  try {
    const { id, imageId } = req.params;
    if (isNaN(id) || isNaN(imageId) || parseInt(id) <= 0 || parseInt(imageId) <= 0)
      return res.status(400).json({ success: false, message: "Invalid listing or image ID." });

    const seller_id = 2;
    const ownershipCheck = await pool.query("SELECT id FROM listings WHERE id = $1 AND seller_id = $2", [id, seller_id]);
    if (ownershipCheck.rows.length === 0) return res.status(404).json({ success: false, message: "No permission." });

    const imageQuery = await pool.query("SELECT public_id FROM listing_images WHERE id = $1 AND listing_id = $2", [imageId, id]);
    if (imageQuery.rows.length === 0) return res.status(404).json({ success: false, message: "Image not found." });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(imageQuery.rows[0].public_id);

    const deleteResult = await pool.query("DELETE FROM listing_images WHERE id = $1 AND listing_id = $2 RETURNING *", [imageId, id]);
    res.json({ success: true, message: "Image deleted successfully", data: deleteResult.rows[0] });
  } catch (err) {
    console.error("Delete image error:", err.message);
    res.status(500).json({ success: false, message: "Could not delete image." });
  }
});

export default router;
