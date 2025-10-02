// src/routes/search.route.js
import express from 'express';
import { searchListings } from '../controllers/search.controller.js';

const router = express.Router();

// GET /api/search/listings
router.get('/listings', searchListings);

export default router;