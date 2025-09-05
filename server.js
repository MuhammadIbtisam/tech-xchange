const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Debug: Log static file serving
app.use('/uploads', (req, res, next) => {
  console.log('📁 Static file request:', req.path);
  next();
});

// Test endpoint for image serving
app.get('/test-image/:filename', (req, res) => {
  const filename = req.params.filename;
  console.log('🧪 Testing image:', filename);
  res.sendFile(path.join(__dirname, 'uploads', 'products', filename));
});

// Mount all API routes
app.use('/api', require('./routes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));