// app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 5000; 

app.use(cors()); 
app.use(express.json()); 

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Import routes
const listingsRoutes = require('./routes/listings');

app.use('/api/listings', listingsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from NWU Student Market backend!' });
});

// STARTING THE SERVER
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});