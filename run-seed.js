console.log('Starting Tech-Xchange Database Seeding...\n');

// Check if .env file exists
const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.error('Error: .env file not found!');
  console.log('Please create a .env file with your MONGO_URI');
  console.log('Example: MONGO_URI=mongodb://localhost:27017/tech-xchange');
  process.exit(1);
}

// Run the seed file
try {
  require('./seed.js');
} catch (error) {
  console.error('Failed to run seed file:', error.message);
  process.exit(1);
}

