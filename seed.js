require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const ProductType = require('./models/ProductType');

const categories = [
  { name: 'laptops', displayName: 'Laptops', description: 'Portable computers' },
  { name: 'phones', displayName: 'Phones', description: 'Smartphones and mobile phones' },
  { name: 'accessories', displayName: 'Accessories', description: 'Tech accessories' },
  { name: 'software', displayName: 'Software', description: 'Software products' },
  { name: 'services', displayName: 'Services', description: 'Tech-related services' }
];

const brands = [
  { name: 'Apple', description: 'Apple Inc.' },
  { name: 'Samsung', description: 'Samsung Electronics' },
  { name: 'Lenovo', description: 'Lenovo Group' },
  { name: 'Dell', description: 'Dell Technologies' },
  { name: 'HP', description: 'Hewlett-Packard' }
];

const productTypes = [
  
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Connected to MongoDB');

  // Clear existing data
  await Category.deleteMany({});
  await Brand.deleteMany({});
  await ProductType.deleteMany({});

  // Insert categories
  const insertedCategories = await Category.insertMany(categories);
  console.log('Categories seeded');

  // Insert brands
  const insertedBrands = await Brand.insertMany(brands);
  console.log('Brands seeded');

  // Prepare product types with references
  productTypes.push(
    // Apple Products
    {
      name: 'iPhone 16',
      brandId: insertedBrands.find(b => b.name === 'Apple')._id,
      categoryId: insertedCategories.find(c => c.name === 'phones')._id,
      description: 'Apple iPhone 16 smartphone',
      specifications: { screen: '6.1"', ram: '8GB', storage: '256GB', camera: '48MP' }
    },
    {
      name: 'iPhone 16 Pro',
      brandId: insertedBrands.find(b => b.name === 'Apple')._id,
      categoryId: insertedCategories.find(c => c.name === 'phones')._id,
      description: 'Apple iPhone 16 Pro smartphone',
      specifications: { screen: '6.7"', ram: '12GB', storage: '512GB', camera: '48MP Pro' }
    },
    {
      name: 'MacBook Pro 14"',
      brandId: insertedBrands.find(b => b.name === 'Apple')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'Apple MacBook Pro 14-inch laptop',
      specifications: { screen: '14"', ram: '16GB', storage: '512GB', processor: 'M3 Pro' }
    },
    {
      name: 'MacBook Air 13"',
      brandId: insertedBrands.find(b => b.name === 'Apple')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'Apple MacBook Air 13-inch laptop',
      specifications: { screen: '13.6"', ram: '8GB', storage: '256GB', processor: 'M2' }
    },
    {
      name: 'iPad Pro 12.9"',
      brandId: insertedBrands.find(b => b.name === 'Apple')._id,
      categoryId: insertedCategories.find(c => c.name === 'accessories')._id,
      description: 'Apple iPad Pro 12.9-inch tablet',
      specifications: { screen: '12.9"', ram: '8GB', storage: '256GB', processor: 'M2' }
    },

    // Samsung Products
    {
      name: 'Samsung Galaxy S24',
      brandId: insertedBrands.find(b => b.name === 'Samsung')._id,
      categoryId: insertedCategories.find(c => c.name === 'phones')._id,
      description: 'Samsung Galaxy S24 smartphone',
      specifications: { screen: '6.2"', ram: '8GB', storage: '256GB', camera: '50MP' }
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      brandId: insertedBrands.find(b => b.name === 'Samsung')._id,
      categoryId: insertedCategories.find(c => c.name === 'phones')._id,
      description: 'Samsung Galaxy S24 Ultra smartphone',
      specifications: { screen: '6.8"', ram: '12GB', storage: '512GB', camera: '200MP' }
    },
    {
      name: 'Samsung Galaxy Tab S9',
      brandId: insertedBrands.find(b => b.name === 'Samsung')._id,
      categoryId: insertedCategories.find(c => c.name === 'accessories')._id,
      description: 'Samsung Galaxy Tab S9 tablet',
      specifications: { screen: '11"', ram: '8GB', storage: '256GB', processor: 'Snapdragon 8 Gen 2' }
    },

    // Lenovo Products
    {
      name: 'ThinkPad X1 Carbon',
      brandId: insertedBrands.find(b => b.name === 'Lenovo')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'Lenovo ThinkPad X1 Carbon laptop',
      specifications: { screen: '14"', ram: '16GB', storage: '1TB', processor: 'Intel i7' }
    },
    {
      name: 'ThinkPad P16',
      brandId: insertedBrands.find(b => b.name === 'Lenovo')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'Lenovo ThinkPad P16 workstation',
      specifications: { screen: '16"', ram: '32GB', storage: '2TB', processor: 'Intel i9' }
    },
    {
      name: 'Yoga 9i',
      brandId: insertedBrands.find(b => b.name === 'Lenovo')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'Lenovo Yoga 9i convertible laptop',
      specifications: { screen: '14"', ram: '16GB', storage: '512GB', processor: 'Intel i7' }
    },

    // Dell Products
    {
      name: 'Dell XPS 13',
      brandId: insertedBrands.find(b => b.name === 'Dell')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'Dell XPS 13 laptop',
      specifications: { screen: '13.4"', ram: '16GB', storage: '512GB', processor: 'Intel i7' }
    },
    {
      name: 'Dell XPS 15',
      brandId: insertedBrands.find(b => b.name === 'Dell')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'Dell XPS 15 laptop',
      specifications: { screen: '15.6"', ram: '32GB', storage: '1TB', processor: 'Intel i9' }
    },
    {
      name: 'Dell Precision 5570',
      brandId: insertedBrands.find(b => b.name === 'Dell')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'Dell Precision 5570 workstation',
      specifications: { screen: '15.6"', ram: '64GB', storage: '2TB', processor: 'Intel i9' }
    },

    // HP Products
    {
      name: 'HP Spectre x360',
      brandId: insertedBrands.find(b => b.name === 'HP')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'HP Spectre x360 convertible laptop',
      specifications: { screen: '13.5"', ram: '16GB', storage: '512GB', processor: 'Intel i7' }
    },
    {
      name: 'HP EliteBook 840',
      brandId: insertedBrands.find(b => b.name === 'HP')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'HP EliteBook 840 business laptop',
      specifications: { screen: '14"', ram: '16GB', storage: '512GB', processor: 'Intel i7' }
    },
    {
      name: 'HP ZBook Studio',
      brandId: insertedBrands.find(b => b.name === 'HP')._id,
      categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
      description: 'HP ZBook Studio workstation',
      specifications: { screen: '15.6"', ram: '32GB', storage: '1TB', processor: 'Intel i9' }
    }
  );

  await ProductType.insertMany(productTypes);
  console.log('Product types seeded');

  await mongoose.disconnect();
  console.log('Seeding complete!');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
}); 