// routes/listings.route.js
import express from "express";
import upload from "../config/multer.js";
import { pool } from "../config/db.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// ---------------------------
// GET all listings
// ---------------------------
router.get("/", async (_req, res) => {
  try {
    const query = `
      SELECT 
        L.id, L.type, L.description, L.price, L.status, L.created_at,
        U.full_name AS seller_name,
        C.name AS category_name,
        COALESCE(
          json_agg(
            json_build_object('id', LI.id, 'url', LI.url, 'alt_text', LI.alt_text)
          ) FILTER (WHERE LI.id IS NOT NULL), '[]'
        ) AS images
      FROM listings L
      INNER JOIN users U ON L.seller_id = U.id
      LEFT JOIN categories C ON L.category_id = C.id
      LEFT JOIN listing_images LI ON LI.listing_id = L.id
      WHERE L.status = 'active'
      GROUP BY L.id, U.full_name, C.name
      ORDER BY L.created_at DESC;
    `;
    const result = await pool.query(query);

    const listings = result.rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.description.substring(0, 50) + (row.description.length > 50 ? "..." : ""),
      description: row.description,
      price: row.price,
      status: row.status,
      category: row.category_name,
      seller: row.seller_name,
      postedDate: row.created_at,
      images: row.images,
    }));

    res.json({ success: true, count: listings.length, data: listings });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Could not retrieve listings" });
  }
});

// ---------------------------
// GET listing by ID
// ---------------------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id) || parseInt(id) <= 0)
      return res.status(400).json({ success: false, message: "Invalid listing ID" });

    const query = `
      SELECT 
        L.id, L.type, L.description, L.price, L.status, L.created_at,
        U.id AS seller_id, U.full_name AS seller_name, U.email AS seller_email, U.student_number AS seller_student_number,
        C.name AS category_name,
        COALESCE(
          json_agg(
            json_build_object('id', LI.id, 'url', LI.url, 'alt_text', LI.alt_text)
          ) FILTER (WHERE LI.id IS NOT NULL), '[]'
        ) AS images
      FROM listings L
      INNER JOIN users U ON L.seller_id = U.id
      LEFT JOIN categories C ON L.category_id = C.id
      LEFT JOIN listing_images LI ON LI.listing_id = L.id
      WHERE L.id = $1
      GROUP BY L.id, U.id, U.full_name, U.email, U.student_number, C.name;
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Listing not found" });

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
          studentNumber: listing.seller_student_number
        },
        images: listing.images
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Could not retrieve listing" });
  }
});

// ---------------------------
// CREATE listing
// ---------------------------
router.post("/", authenticate, async (req, res) => {
  try {
    const { category_id, type, description, price } = req.body;
    if (!category_id || !type || !description || !price)
      return res.status(400).json({ success: false, message: "Missing required fields." });

    if (!["product", "service"].includes(type))
      return res.status(400).json({ success: false, message: 'Type must be "product" or "service".' });

    const seller_id = req.user.id;

    const query = `
      INSERT INTO listings (seller_id, category_id, type, description, price, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *;
    `;
    const result = await pool.query(query, [seller_id, category_id, type, description, price]);
    res.status(201).json({ success: true, message: "Listing created successfully", data: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Could not create listing" });
  }
});

// ---------------------------
// UPDATE listing
// ---------------------------
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, type, description, price, status } = req.body;
    const seller_id = req.user.id;

    const ownershipCheck = await pool.query("SELECT id FROM listings WHERE id=$1 AND seller_id=$2", [id, seller_id]);
    if (ownershipCheck.rows.length === 0)
      return res.status(403).json({ success: false, message: "No permission to update listing" });

    const fields = [];
    const values = [];
    if (category_id) { fields.push(`category_id=$${values.length+1}`); values.push(category_id); }
    if (type) { fields.push(`type=$${values.length+1}`); values.push(type); }
    if (description) { fields.push(`description=$${values.length+1}`); values.push(description); }
    if (price) { fields.push(`price=$${values.length+1}`); values.push(price); }
    if (status) { fields.push(`status=$${values.length+1}`); values.push(status); }
    values.push(id, seller_id);

    const query = `UPDATE listings SET ${fields.join(", ")} WHERE id=$${values.length-1} AND seller_id=$${values.length} RETURNING *`;
    const result = await pool.query(query, values);
    res.json({ success: true, message: "Listing updated", data: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Could not update listing" });
  }
});

// ---------------------------
// DELETE listing (soft delete)
// ---------------------------
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.id;

    const ownershipCheck = await pool.query("SELECT id FROM listings WHERE id=$1 AND seller_id=$2", [id, seller_id]);
    if (ownershipCheck.rows.length === 0)
      return res.status(403).json({ success: false, message: "No permission to delete listing" });

    const query = "UPDATE listings SET status='inactive' WHERE id=$1 AND seller_id=$2 RETURNING *";
    const result = await pool.query(query, [id, seller_id]);
    res.json({ success: true, message: "Listing deleted", data: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Could not delete listing" });
  }
});

// ---------------------------
// UPLOAD listing image
// ---------------------------
router.post("/:id/images", authenticate, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.id;

    // ownership check
    const ownershipCheck = await pool.query("SELECT id FROM listings WHERE id=$1 AND seller_id=$2", [id, seller_id]);
    if (ownershipCheck.rows.length === 0)
      return res.status(403).json({ success: false, message: "Not authorized to upload to this listing" });

    if (!req.file)
      return res.status(400).json({ success: false, message: "No image uploaded" });

    // upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { folder: `listings/${id}` });
    const altText = req.body.alt_text || `Image for listing ${id}`;

    // insert into DB including public_id
    const dbResult = await pool.query(
      `INSERT INTO listing_images (listing_id, url, alt_text, public_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, result.secure_url, altText, result.public_id]
    );

    res.status(201).json({ success: true, message: "Image uploaded successfully", data: dbResult.rows[0] });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ success: false, message: "Could not upload image" });
  }
});

// ---------------------------
// DELETE listing image
// ---------------------------
router.delete("/:id/images/:imageId", authenticate, async (req, res) => {
  try {
    const { imageId } = req.params;
    const seller_id = req.user.id;

    const imageQuery = `
      SELECT li.public_id, l.seller_id
      FROM listing_images li
      JOIN listings l ON li.listing_id = l.id
      WHERE li.id=$1
    `;
    const { rows } = await pool.query(imageQuery, [imageId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Image not found" });

    const image = rows[0];
    if (image.seller_id !== seller_id) return res.status(403).json({ success: false, message: "Unauthorized" });

    await cloudinary.uploader.destroy(image.public_id);
    await pool.query("DELETE FROM listing_images WHERE id=$1", [imageId]);

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Failed to delete image" });
  }
});

export default router;
