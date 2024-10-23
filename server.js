const express = require('express');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/transactions', transactionRoutes);
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
