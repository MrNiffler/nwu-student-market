// src/controllers/search.controller.js
import { pool } from '../config/db.js';

export async function searchListings(req, res) {
  try {
    const {
      q,
      category_id,
      type,
      price_min,
      price_max,
      status,
      sort_by,
      order,
      page = 1,
      limit = 10,
    } = req.query;

    const pageInt = Math.max(parseInt(page, 10), 1);
    const limitInt = Math.min(Math.max(parseInt(limit, 10), 1), 100);
    const offset = (pageInt - 1) * limitInt;

    const allowedSortFields = ['price', 'created_at', 'id'];
    const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortOrder = order && order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const filterValues = [];
    const whereClauses = [];

    if (q) {
      filterValues.push(`%${q}%`);
      whereClauses.push(`L.description ILIKE $${filterValues.length}`);
    }
    if (category_id) {
      filterValues.push(parseInt(category_id, 10));
      whereClauses.push(`L.category_id = $${filterValues.length}`);
    }
    if (type) {
      filterValues.push(type);
      whereClauses.push(`L.type = $${filterValues.length}`);
    }
    if (price_min) {
      filterValues.push(parseFloat(price_min));
      whereClauses.push(`L.price >= $${filterValues.length}`);
    }
    if (price_max) {
      filterValues.push(parseFloat(price_max));
      whereClauses.push(`L.price <= $${filterValues.length}`);
    }
    if (status) {
      filterValues.push(status);
      whereClauses.push(`L.status = $${filterValues.length}`);
    } else {
      // default to active listings
      filterValues.push('active');
      whereClauses.push(`L.status = $${filterValues.length}`);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Total count
    const countQuery = `SELECT COUNT(*) AS total FROM Listings L ${whereSQL}`;
    const countResult = await pool.query(countQuery, filterValues);
    const total = parseInt(countResult.rows[0].total, 10);

    // Main query with seller, category, and first image
    const mainQuery = `
      SELECT
        L.*,
        U.full_name AS seller_name,
        U.email AS seller_email,
        U.student_number AS seller_student_number,
        C.name AS category_name,
        (SELECT url FROM listing_images LI WHERE LI.listing_id = L.id ORDER BY LI.id ASC LIMIT 1) AS image_url
      FROM Listings L
      INNER JOIN Users U ON L.seller_id = U.id
      LEFT JOIN Categories C ON L.category_id = C.id
      ${whereSQL}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $${filterValues.length + 1}
      OFFSET $${filterValues.length + 2}
    `;
    filterValues.push(limitInt, offset);

    const listingsResult = await pool.query(mainQuery, filterValues);

    // Format listings
    const listings = listingsResult.rows.map((row) => ({
      id: row.id,
      type: row.type,
      description: row.description,
      price: row.price,
      status: row.status,
      category: row.category_name,
      postedDate: row.created_at,
      seller: {
        name: row.seller_name,
        email: row.seller_email,
        studentNumber: row.seller_student_number,
      },
      imageUrl: row.image_url ? row.image_url : null,
      fullImageUrl: row.image_url ? `https://res.cloudinary.com/YOUR_CLOUD_NAME/${row.image_url}` : null,
    }));

    res.json({
      total,
      page: pageInt,
      limit: limitInt,
      listings,
    });
  } catch (err) {
    console.error('searchListings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
