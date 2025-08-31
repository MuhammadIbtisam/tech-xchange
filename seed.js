require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const ProductType = require('./models/ProductType');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Order = require('./models/Order');
const SavedItem = require('./models/SavedItem');
const Notification = require('./models/Notification');

// Demo data arrays
const categories = [
  { name: 'laptops', displayName: 'Laptops', description: 'Portable computers and workstations' },
  { name: 'phones', displayName: 'Smartphones', description: 'Mobile phones and smartphones' },
  { name: 'tablets', displayName: 'Tablets', description: 'Tablet computers and iPads' },
  { name: 'accessories', displayName: 'Accessories', description: 'Tech accessories and peripherals' },
  { name: 'gaming', displayName: 'Gaming', description: 'Gaming consoles and accessories' },
  { name: 'audio', displayName: 'Audio', description: 'Headphones, speakers, and audio equipment' }
];

const brands = [
  { name: 'Apple', description: 'Apple Inc. - Premium technology products', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop&crop=center' },
  { name: 'Samsung', description: 'Samsung Electronics - Korean technology giant', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop&crop=center' },
  { name: 'Lenovo', description: 'Lenovo Group - Chinese technology company', logo: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop&crop=center' },
  { name: 'Dell', description: 'Dell Technologies - American technology company', logo: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop&crop=center' },
  { name: 'HP', description: 'Hewlett-Packard - American technology company', logo: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop&crop=center' },
  { name: 'Sony', description: 'Sony Corporation - Japanese technology company', logo: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop&crop=center' },
  { name: 'Microsoft', description: 'Microsoft Corporation - American technology company', logo: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop&crop=center' }
];

// Sample product images from Unsplash
const productImages = {
  laptops: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
  ],
  phones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=600&fit=crop'
  ],
  tablets: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542751371-29b2f704ada3?w=800&h=600&fit=crop'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop'
  ],
  gaming: [
    'https://images.unsplash.com/photo-1542751371-29b2f704ada3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop'
  ],
  audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop'
  ]
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await ProductType.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await SavedItem.deleteMany({});
    await Notification.deleteMany({});

    // Create users
    console.log('Creating users...');
    const adminPassword = await bcrypt.hash('Admin123', 12);
    const sellerPassword = await bcrypt.hash('Seller123', 12);
    const buyerPassword = await bcrypt.hash('Buyer123', 12);
    
    const users = await User.insertMany([
      {
        fullName: 'James Admin',
        email: 'admin@techxchange.com',
        phoneNumber: '+447911123456',
        password: adminPassword,
        role: 'admin',
        isVerified: true,
        address: {
          street: '123 Tech Street',
          city: 'London',
          state: 'Greater London',
          zipCode: 'SW1A 1AA',
          country: 'UK'
        },
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        preferences: {
          currency: 'GBP',
          notifications: {
            email: true,
            push: true
          }
        }
      },
      {
        fullName: 'Sarah Wilson',
        email: 'sarah.wilson@gmail.com',
        phoneNumber: '+447911123457',
        password: sellerPassword,
        role: 'seller',
        isVerified: true,
        address: {
          street: '456 Business Avenue',
          city: 'Manchester',
          state: 'Greater Manchester',
          zipCode: 'M1 1AA',
          country: 'UK'
        },
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
        preferences: {
          currency: 'GBP',
          notifications: {
            email: true,
            push: true
          }
        }
      },
      {
        fullName: 'Michael Brown',
        email: 'mike.brown@hotmail.com',
        phoneNumber: '+447911123458',
        password: buyerPassword,
        role: 'buyer',
        isVerified: true,
        address: {
          street: '789 Customer Road',
          city: 'Birmingham',
          state: 'West Midlands',
          zipCode: 'B1 1AA',
          country: 'UK'
        },
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        preferences: {
          currency: 'GBP',
          notifications: {
            email: true,
            push: true
          }
        }
      },
      {
        fullName: 'Lisa Thompson',
        email: 'lisa.thompson@outlook.com',
        phoneNumber: '+447911123459',
        password: sellerPassword,
        role: 'seller',
        isVerified: true,
        address: {
          street: '321 Innovation Lane',
          city: 'Edinburgh',
          state: 'Scotland',
          zipCode: 'EH1 1AA',
          country: 'UK'
        },
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        preferences: {
          currency: 'GBP',
          notifications: {
            email: true,
            push: true
          }
        }
      },
      {
        fullName: 'David Mitchell',
        email: 'david.mitchell@yahoo.com',
        phoneNumber: '+447911123460',
        password: buyerPassword,
        role: 'buyer',
        isVerified: true,
        address: {
          street: '654 Service Street',
          city: 'Liverpool',
          state: 'Merseyside',
          zipCode: 'L1 1AA',
          country: 'UK'
        },
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        preferences: {
          currency: 'GBP',
          notifications: {
            email: true,
            push: true
          }
        }
      }
    ]);

    const adminUser = users.find(u => u.role === 'admin');
    const sellerUsers = users.filter(u => u.role === 'seller');
    const buyerUsers = users.filter(u => u.role === 'buyer');

    // Insert categories
    console.log('Creating categories...');
    const insertedCategories = await Category.insertMany(categories);

    // Insert brands
    console.log('Creating brands...');
    const insertedBrands = await Brand.insertMany(brands);

    // Create product types
    console.log('Creating product types...');
    const productTypes = [
      // Apple Products
      {
        name: 'iPhone 15 Pro',
        brandId: insertedBrands.find(b => b.name === 'Apple')._id,
        categoryId: insertedCategories.find(c => c.name === 'phones')._id,
        description: 'Latest iPhone with A17 Pro chip and titanium design',
        specifications: { screen: '6.1"', ram: '8GB', storage: '256GB', camera: '48MP' }
      },
      {
        name: 'iPhone 15 Pro Max',
        brandId: insertedBrands.find(b => b.name === 'Apple')._id,
        categoryId: insertedCategories.find(c => c.name === 'phones')._id,
        description: 'Largest iPhone with A17 Pro chip and 5x optical zoom',
        specifications: { screen: '6.7"', ram: '8GB', storage: '512GB', camera: '48MP Pro' }
      },
      {
        name: 'MacBook Pro 16"',
        brandId: insertedBrands.find(b => b.name === 'Apple')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Professional laptop with M3 Max chip',
        specifications: { screen: '16"', ram: '32GB', storage: '1TB', processor: 'M3 Max' }
      },
      {
        name: 'MacBook Air 15"',
        brandId: insertedBrands.find(b => b.name === 'Apple')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Lightweight laptop with M2 chip',
        specifications: { screen: '15.3"', ram: '16GB', storage: '512GB', processor: 'M2' }
      },
      {
        name: 'iPad Pro 12.9"',
        brandId: insertedBrands.find(b => b.name === 'Apple')._id,
        categoryId: insertedCategories.find(c => c.name === 'tablets')._id,
        description: 'Professional tablet with M2 chip and Liquid Retina XDR display',
        specifications: { screen: '12.9"', ram: '8GB', storage: '256GB', processor: 'M2' }
      },

      // Samsung Products
      {
        name: 'Galaxy S24 Ultra',
        brandId: insertedBrands.find(b => b.name === 'Samsung')._id,
        categoryId: insertedCategories.find(c => c.name === 'phones')._id,
        description: 'Flagship Samsung phone with S Pen and AI features',
        specifications: { screen: '6.8"', ram: '12GB', storage: '512GB', camera: '200MP' }
      },
      {
        name: 'Galaxy S24+',
        brandId: insertedBrands.find(b => b.name === 'Samsung')._id,
        categoryId: insertedCategories.find(c => c.name === 'phones')._id,
        description: 'Premium Samsung phone with advanced AI capabilities',
        specifications: { screen: '6.7"', ram: '12GB', storage: '256GB', camera: '50MP' }
      },
      {
        name: 'Galaxy Tab S9 Ultra',
        brandId: insertedBrands.find(b => b.name === 'Samsung')._id,
        categoryId: insertedCategories.find(c => c.name === 'tablets')._id,
        description: 'Large tablet with S Pen and AMOLED display',
        specifications: { screen: '14.6"', ram: '12GB', storage: '512GB', processor: 'Snapdragon 8 Gen 2' }
      },

      // Lenovo Products
      {
        name: 'ThinkPad X1 Carbon',
        brandId: insertedBrands.find(b => b.name === 'Lenovo')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Premium business laptop with carbon fiber construction',
        specifications: { screen: '14"', ram: '32GB', storage: '1TB', processor: 'Intel i7-1355U' }
      },
      {
        name: 'ThinkPad P16',
        brandId: insertedBrands.find(b => b.name === 'Lenovo')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Mobile workstation for professionals',
        specifications: { screen: '16"', ram: '64GB', storage: '2TB', processor: 'Intel i9-13900H' }
      },
      {
        name: 'Yoga 9i',
        brandId: insertedBrands.find(b => b.name === 'Lenovo')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Convertible laptop with 360-degree hinge',
        specifications: { screen: '14"', ram: '16GB', storage: '512GB', processor: 'Intel i7-1355U' }
      },

      // Dell Products
      {
        name: 'XPS 13 Plus',
        brandId: insertedBrands.find(b => b.name === 'Dell')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Premium ultrabook with edge-to-edge display',
        specifications: { screen: '13.4"', ram: '32GB', storage: '1TB', processor: 'Intel i7-1360P' }
      },
      {
        name: 'XPS 15',
        brandId: insertedBrands.find(b => b.name === 'Dell')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Powerful laptop for creators and professionals',
        specifications: { screen: '15.6"', ram: '32GB', storage: '1TB', processor: 'Intel i9-13900H' }
      },
      {
        name: 'Precision 5680',
        brandId: insertedBrands.find(b => b.name === 'Dell')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Mobile workstation with RTX graphics',
        specifications: { screen: '16"', ram: '64GB', storage: '2TB', processor: 'Intel i9-13900H' }
      },

      // HP Products
      {
        name: 'Spectre x360 14',
        brandId: insertedBrands.find(b => b.name === 'HP')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Premium convertible laptop with OLED display',
        specifications: { screen: '14"', ram: '16GB', storage: '1TB', processor: 'Intel i7-1355U' }
      },
      {
        name: 'EliteBook 840',
        brandId: insertedBrands.find(b => b.name === 'HP')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Business laptop with security features',
        specifications: { screen: '14"', ram: '16GB', storage: '512GB', processor: 'Intel i7-1355U' }
      },
      {
        name: 'ZBook Studio',
        brandId: insertedBrands.find(b => b.name === 'HP')._id,
        categoryId: insertedCategories.find(c => c.name === 'laptops')._id,
        description: 'Mobile workstation for creative professionals',
        specifications: { screen: '15.6"', ram: '32GB', storage: '1TB', processor: 'Intel i9-13900H' }
      },

      // Sony Products
      {
        name: 'WH-1000XM5',
        brandId: insertedBrands.find(b => b.name === 'Sony')._id,
        categoryId: insertedCategories.find(c => c.name === 'audio')._id,
        description: 'Premium noise-canceling headphones',
        specifications: { type: 'Over-ear', connectivity: 'Bluetooth 5.2', battery: '30 hours' }
      },
      {
        name: 'PlayStation 5',
        brandId: insertedBrands.find(b => b.name === 'Sony')._id,
        categoryId: insertedCategories.find(c => c.name === 'gaming')._id,
        description: 'Next-generation gaming console',
        specifications: { storage: '1TB SSD', resolution: '4K', fps: '120fps' }
      },

      // Microsoft Products
      {
        name: 'Surface Pro 9',
        brandId: insertedBrands.find(b => b.name === 'Microsoft')._id,
        categoryId: insertedCategories.find(c => c.name === 'tablets')._id,
        description: '2-in-1 tablet and laptop',
        specifications: { screen: '13"', ram: '16GB', storage: '256GB', processor: 'Intel i7' }
      }
    ];

    const insertedProductTypes = await ProductType.insertMany(productTypes);

    // Create products
    console.log('Creating products...');
    const products = [];
    
    for (let i = 0; i < insertedProductTypes.length; i++) {
      const productType = insertedProductTypes[i];
      const category = insertedCategories.find(c => c._id.equals(productType.categoryId));
      const seller = sellerUsers[i % sellerUsers.length];
      
      // Get random images for this category
      const categoryImages = productImages[category.name] || productImages.accessories;
      const randomImages = categoryImages.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, categoryImages.length));
      
      const product = {
        sellerId: seller._id,
        productTypeId: productType._id,
        price: Math.floor(Math.random() * 1500) + 150, // Random price between £150-£1650
        currency: 'GBP',
        condition: ['new', 'like-new', 'used', 'refurbished'][Math.floor(Math.random() * 4)],
        images: randomImages,
        description: productType.description,
        specifications: productType.specifications,
        stock: Math.floor(Math.random() * 10) + 1,
        status: 'approved',
        approvedBy: adminUser._id,
        approvedAt: new Date(),
        tags: [category.name, productType.brandId ? insertedBrands.find(b => b._id.equals(productType.brandId)).name : ''],
        views: Math.floor(Math.random() * 1000),
        isFeatured: Math.random() > 0.7 // 30% chance of being featured
      };
      
      products.push(product);
    }

    const insertedProducts = await Product.insertMany(products);

    // Create reviews
    console.log('Creating reviews...');
    const reviews = [];
    
    for (const product of insertedProducts) {
      // Create 2-5 reviews per product, but ensure each user only reviews once
      const numReviews = Math.min(Math.floor(Math.random() * 4) + 2, buyerUsers.length);
      
      // Shuffle buyer users to get random reviewers
      const shuffledBuyers = [...buyerUsers].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < numReviews; i++) {
        const reviewer = shuffledBuyers[i];
        const review = {
          productId: product._id,
          userId: reviewer._id,
          rating: Math.floor(Math.random() * 5) + 1,
          comment: generateReviewComment(product, i),
          isVerified: Math.random() > 0.3, // 70% chance of being verified
          helpful: []
        };
        
        // Add some helpful votes
        if (Math.random() > 0.5) {
          const helpfulUsers = buyerUsers.filter(u => !u._id.equals(reviewer._id)).slice(0, Math.floor(Math.random() * 3));
          review.helpful = helpfulUsers.map(u => ({ userId: u._id }));
        }
        
        reviews.push(review);
      }
    }

    await Review.insertMany(reviews);

    // Create orders
    console.log('Creating orders...');
    const orders = [];
    
    for (let i = 0; i < 20; i++) {
      const buyer = buyerUsers[Math.floor(Math.random() * buyerUsers.length)];
      const product = insertedProducts[Math.floor(Math.random() * insertedProducts.length)];
      const seller = sellerUsers.find(s => s._id.equals(product.sellerId));
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      const order = {
        buyerId: buyer._id,
        sellerId: seller._id,
        productId: product._id,
        quantity: quantity,
        unitPrice: product.price,
        totalAmount: product.price * quantity,
        currency: 'GBP',
        status: ['pending', 'confirmed', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        paymentStatus: ['pending', 'paid', 'failed'][Math.floor(Math.random() * 3)],
        paymentMethod: ['credit_card', 'paypal', 'bank_transfer'][Math.floor(Math.random() * 3)],
        shippingAddress: {
          ...buyer.address,
          phone: buyer.phoneNumber
        },
        shippingMethod: ['standard', 'express', 'overnight'][Math.floor(Math.random() * 3)],
        shippingCost: Math.floor(Math.random() * 20) + 5
      };
      
      orders.push(order);
    }

    await Order.insertMany(orders);

    // Create saved items
    console.log('Creating saved items...');
    const savedItems = [];
    
    for (const buyer of buyerUsers) {
      const numSaved = Math.floor(Math.random() * 5) + 1;
      const randomProducts = insertedProducts.sort(() => 0.5 - Math.random()).slice(0, numSaved);
      
      for (const product of randomProducts) {
        savedItems.push({
          userId: buyer._id,
          productId: product._id,
          notes: Math.random() > 0.7 ? 'Great product!' : null
        });
      }
    }

    await SavedItem.insertMany(savedItems);

    // Create notifications
    console.log('Creating notifications...');
    const notifications = [];
    
    for (const user of users) {
      const numNotifications = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < numNotifications; i++) {
        const notification = {
          userId: user._id,
          title: generateNotificationTitle(user, i),
          message: generateNotificationMessage(user, i),
          type: ['order_created', 'product_approved', 'new_review', 'price_drop', 'stock_update', 'payment_success'][Math.floor(Math.random() * 6)],
          isRead: Math.random() > 0.3,
          relatedId: insertedProducts[Math.floor(Math.random() * insertedProducts.length)]._id,
          relatedModel: 'Product'
        };
        
        notifications.push(notification);
      }
    }

    await Notification.insertMany(notifications);

    console.log('✅ Seeding completed successfully!');
    console.log(`📊 Created ${users.length} users`);
    console.log(`📁 Created ${insertedCategories.length} categories`);
    console.log(`🏷️ Created ${insertedBrands.length} brands`);
    console.log(`🔧 Created ${insertedProductTypes.length} product types`);
    console.log(`📦 Created ${insertedProducts.length} products`);
    console.log(`⭐ Created ${reviews.length} reviews`);
    console.log(`📋 Created ${orders.length} orders`);
    console.log(`❤️ Created ${savedItems.length} saved items`);
    console.log(`🔔 Created ${notifications.length} notifications`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (err) {
    console.error('❌ Seeding error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Helper functions
function generateReviewComment(product, index) {
  const comments = [
    'Great product, highly recommend!',
    'Excellent quality and fast shipping.',
    'Good value for money.',
    'Product arrived in perfect condition.',
    'Very satisfied with this purchase.',
    'Would buy again from this seller.',
    'Fast delivery and great communication.',
    'Product meets all expectations.',
    'Great seller, highly trustworthy.',
    'Quality product at a fair price.'
  ];
  
  return comments[index % comments.length];
}

function generateNotificationTitle(user, index) {
  const titles = [
    'Order Update',
    'Product Approved',
    'New Message',
    'Price Drop Alert',
    'Welcome to Tech-Xchange'
  ];
  
  return titles[index % titles.length];
}

function generateNotificationMessage(user, index) {
  const messages = [
    `Hi ${user.fullName.split(' ')[0]}, your order has been updated.`,
    'Your product has been approved and is now live!',
    'You have a new message from a buyer.',
    'A product on your wishlist has dropped in price!',
    'Welcome to Tech-Xchange! Start exploring our tech marketplace.'
  ];
  
  return messages[index % messages.length];
}

// Run the seed function
seed(); 