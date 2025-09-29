const express = require('express');
const bodyParser = require('body-parser');

// Import Member 4 routes
const member4Routes = require('./src/routes/member4Routes');

const app = express();
app.use(bodyParser.json());

// Use Member 4 routes
app.use('/api', member4Routes);

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
