// routes/listings.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const upload = require('../config/multer');
const path = require('path');
const fs = require('fs');

// The GET api listings to Get all listings
router.get('/', async (req, res) => {
  console.log('GET /api/listings request received');

  try {
    const query = `
      SELECT 
        L.id, 
        L.type, 
        L.description, 
        L.price, 
        L.status, 
        L.created_at,
        U.full_name as seller_name,
        C.name as category_name
      FROM Listings L
      INNER JOIN Users U ON L.seller_id = U.id
      LEFT JOIN Categories C ON L.category_id = C.id
      WHERE L.status = 'active'
      ORDER BY L.created_at DESC;
    `;

    const result = await db.query(query);
    
    const listings = result.rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.description.substring(0, 50) + (row.description.length > 50 ? '...' : ''),
      description: row.description,
      price: row.price,
      status: row.status,
      category: row.category_name,
      seller: row.seller_name,
      postedDate: row.created_at
    }));

    res.json({
      success: true,
      count: listings.length,
      data: listings
    });

  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not retrieve listings.'
    });
  }
});

// The GET api for a single listing by ID
router.get('/:id', async (req, res) => {
  console.log(`GET /api/listings/${req.params.id} request received`);

  try {
    
    const { id } = req.params;

    // check if ID is a valid number
    if (isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID. Please provide a valid numeric ID.'
      });
    }

    // Creating the SQL query 
    const query = `
      SELECT 
        L.id, 
        L.seller_id,
        L.category_id,
        L.type, 
        L.description, 
        L.price, 
        L.status, 
        L.created_at,
        U.full_name as seller_name,
        U.email as seller_email,
        U.student_number as seller_student_number,
        C.name as category_name,
        (SELECT COUNT(*) FROM reviews R WHERE R.reviewee_id = U.id) as seller_review_count
      FROM Listings L
      INNER JOIN Users U ON L.seller_id = U.id
      LEFT JOIN Categories C ON L.category_id = C.id
      WHERE L.id = $1;
    `;

    
    const result = await db.query(query, [id]);

    // Checking if listing was found
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found. No listing exists with the provided ID.'
      });
    }

    // Formating the response data
    const listing = result.rows[0];
    const responseData = {
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
        reviewCount: listing.seller_review_count
      }
    };

    // Returning the listing data
    res.json({
      success: true,
      data: responseData
    });

  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not retrieve the listing.'
    });
  }
});

// The POST api listings for Create a new listing
router.post('/', async (req, res) => {
  console.log('POST /api/listings request received', req.body);

  try {
    
    const { category_id, type, description, price } = req.body;

    
    if (!category_id || !type || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category_id, type, description, and price'
      });
    }

    if (type !== 'product' && type !== 'service') {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "product" or "service"'
      });
    }
  
    const seller_id = 2;

    const query = `
      INSERT INTO listings (seller_id, category_id, type, description, price, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *;
    `;

    const result = await db.query(query, [
      seller_id,
      category_id,
      type,
      description,
      price
    ]);

    // Returning the newly created listing
    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: result.rows[0]
    });

  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not create listing'
    });
  }
});

// The PUT api listings to Update a listing 
router.put('/:id', async (req, res) => {
  console.log(`PUT /api/listings/${req.params.id} request received`, req.body);

  try {
    
    const { id } = req.params;
    const { category_id, type, description, price, status } = req.body;

    // Input validation to check if ID is valid
    if (isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID. Please provide a valid numeric ID.'
      });
    }

    
    if (!category_id && !type && !description && !price && !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update (category_id, type, description, price, or status).'
      });
    }

    
    if (type && type !== 'product' && type !== 'service') {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "product" or "service"'
      });
    }

    
    if (status && status !== 'active' && status !== 'inactive') {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "active" or "inactive"'
      });
    }

    const seller_id = 2;

  
    const ownershipCheck = await db.query(
      'SELECT id FROM listings WHERE id = $1 AND seller_id = $2',
      [id, seller_id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found or you do not have permission to update this listing.'
      });
    }

    // Building the dynamic UPDATE query
    const updateFields = [];
    const values = [];

    if (category_id) {
      updateFields.push('category_id = $' + (values.length + 1));
      values.push(category_id);
    }

    if (type) {
      updateFields.push('type = $' + (values.length + 1));
      values.push(type);
    }

    if (description) {
      updateFields.push('description = $' + (values.length + 1));
      values.push(description);
    }

    if (price) {
      updateFields.push('price = $' + (values.length + 1));
      values.push(price);
    }

    if (status) {
      updateFields.push('status = $' + (values.length + 1));
      values.push(status);
    }

    
    values.push(id, seller_id);

    // Creating and executing the UPDATE query 
    const query = `
      UPDATE listings 
      SET ${updateFields.join(', ')}
      WHERE id = $${values.length - 1} AND seller_id = $${values.length}
      RETURNING *;
    `;

    const result = await db.query(query, values);

    // Returning the updated listing
    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: result.rows[0]
    });

  } catch (err) {
    console.error('Database error details:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not update the listing.',
      error: err.message
    });
  }
});

// The DELETE api listings for Deleting a listing 
router.delete('/:id', async (req, res) => {
  console.log(`DELETE /api/listings/${req.params.id} request received`);

  try {
    
    const { id } = req.params;

    // 2. Input validation to check if ID is a valid number
    if (isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID. Please provide a valid numeric ID.'
      });
    }

    const seller_id = 2;

    // Check if the listing exists and belongs to the current user
    const ownershipCheck = await db.query(
      'SELECT id FROM listings WHERE id = $1 AND seller_id = $2',
      [id, seller_id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found or you do not have permission to delete this listing.'
      });
    }

    // Soft delete 
    const softDeleteQuery = `
      UPDATE listings 
      SET status = 'inactive'
      WHERE id = $1 AND seller_id = $2
      RETURNING *;
    `;

    // Executing the query
    const result = await db.query(softDeleteQuery, [id, seller_id]);

    // Returning success message
    res.json({
      success: true,
      message: 'Listing deleted successfully',
      data: result.rows[0]
    });

  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not delete the listing.'
    });
  }
});

// The POST api listings to Upload image for a listing
router.post('/:id/images', upload.single('image'), async (req, res) => {
  console.log(`POST /api/listings/${req.params.id}/images request received`);

  try {
    // Get the listing ID from URL parameters
    const { id } = req.params;

    // Input validation to check if ID is valid
    if (isNaN(id) || parseInt(id) <= 0) {
      
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID. Please provide a valid numeric ID.'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Please upload an image.'
      });
    }


    const seller_id = 2;

    // Check if the listing exists and belongs to the current user
    const ownershipCheck = await db.query(
      'SELECT id FROM listings WHERE id = $1 AND seller_id = $2',
      [id, seller_id]
    );

    if (ownershipCheck.rows.length === 0) {
      
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Listing not found or you do not have permission to add images to this listing.'
      });
    }

    // Create image URL 
    const imageUrl = `/uploads/${req.file.filename}`;

    // Save image metadata to database
    const query = `
      INSERT INTO listing_images (listing_id, url, alt_text)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const altText = req.body.alt_text || `Image for listing ${id}`;

    const result = await db.query(query, [id, imageUrl, altText]);

    // Return success response with image data
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        id: result.rows[0].id,
        listing_id: result.rows[0].listing_id,
        url: result.rows[0].url,
        alt_text: result.rows[0].alt_text,
        full_path: `http://localhost:5000${result.rows[0].url}`
      }
    });

  } catch (err) {
    
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Image upload error:', err.message);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error: Could not upload image.',
      error: err.message
    });
  }
});

// The GET api listings to Get all images for a specific listing
router.get('/:id/images', async (req, res) => {
  console.log(`GET /api/listings/${req.params.id}/images request received`);

  try {
    const { id } = req.params;

    // Input validation
    if (isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID.'
      });
    }

    // Query to get all images for this listing
    const query = `
      SELECT id, listing_id, url, alt_text
      FROM listing_images 
      WHERE listing_id = $1
      ORDER BY id ASC;
    `;

    const result = await db.query(query, [id]);

    // Add full URL to each image
    const images = result.rows.map(image => ({
      ...image,
      full_url: `http://localhost:5000${image.url}`
    }));

    res.json({
      success: true,
      count: images.length,
      data: images
    });

  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not retrieve images.'
    });
  }
});

// The DELETE api listings to Delete a specific image
router.delete('/:id/images/:imageId', async (req, res) => {
  console.log(`DELETE /api/listings/${req.params.id}/images/${req.params.imageId} request received`);

  try {
    const { id, imageId } = req.params;

    // Input validation
    if (isNaN(id) || parseInt(id) <= 0 || isNaN(imageId) || parseInt(imageId) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid listing ID or image ID.'
      });
    }

    
    const seller_id = 2;

    // checkig if the listing exists and belongs to the current user
    const ownershipCheck = await db.query(
      'SELECT id FROM listings WHERE id = $1 AND seller_id = $2',
      [id, seller_id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found or no permission to modify images.'
      });
    }

    // Get the image info first 
    const imageQuery = 'SELECT url FROM listing_images WHERE id = $1 AND listing_id = $2';
    const imageResult = await db.query(imageQuery, [imageId, id]);

    if (imageResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image not found.'
      });
    }

    const imagePath = imageResult.rows[0].url;

    // Delete the image record from database
    const deleteQuery = 'DELETE FROM listing_images WHERE id = $1 AND listing_id = $2 RETURNING *';
    const deleteResult = await db.query(deleteQuery, [imageId, id]);

    // Delete the actual file from storage
    const fullPath = path.join(__dirname, '..', imagePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: deleteResult.rows[0]
    });

  } catch (err) {
    console.error('Delete image error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not delete image.'
    });
  }
});


module.exports = router;