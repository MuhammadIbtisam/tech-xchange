const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

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