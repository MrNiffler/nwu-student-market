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
      whereClauses.push(`description ILIKE $${filterValues.length}`);
    }
    if (category_id) {
      filterValues.push(parseInt(category_id, 10));
      whereClauses.push(`category_id = $${filterValues.length}`);
    }
    if (type) {
      filterValues.push(type);
      whereClauses.push(`type = $${filterValues.length}`);
    }
    if (price_min) {
      filterValues.push(parseFloat(price_min));
      whereClauses.push(`price >= $${filterValues.length}`);
    }
    if (price_max) {
      filterValues.push(parseFloat(price_max));
      whereClauses.push(`price <= $${filterValues.length}`);
    }
    if (status) {
      filterValues.push(status);
      whereClauses.push(`status = $${filterValues.length}`);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) AS total FROM Listings ${whereSQL}`;
    const countResult = await pool.query(countQuery, filterValues);
    const total = parseInt(countResult.rows[0].total, 10);

    const mainQuery = `
      SELECT * FROM Listings
      ${whereSQL}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT $${filterValues.length + 1}
      OFFSET $${filterValues.length + 2}
    `;
    filterValues.push(limitInt, offset);

    const listingsResult = await pool.query(mainQuery, filterValues);
    const listings = listingsResult.rows;

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
