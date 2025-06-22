const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
require('dotenv').config();

// Sample users data
const sampleUsers = [
  {
    name: 'John Smith',
    email: 'john.smith@email.com',
    password: 'password123',
    phone: '5551234567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    role: 'customer'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    password: 'password123',
    phone: '5552345678',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    role: 'customer'
  },
  {
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    password: 'password123',
    phone: '5553456789',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    role: 'customer'
  },
  {
    name: 'Emily Wilson',
    email: 'emily.wilson@email.com',
    password: 'password123',
    phone: '5554567890',
    address: {
      street: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    },
    role: 'customer'
  },
  {
    name: 'David Brown',
    email: 'david.brown@email.com',
    password: 'password123',
    phone: '5555678901',
    address: {
      street: '654 Maple Dr',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA'
    },
    role: 'customer'
  }
];

// Function to create sample orders
const createSampleOrders = async (users, products) => {
  const orders = [];
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentMethods = ['credit_card', 'debit_card', 'paypal'];

  // Helper function to get random items
  const getRandomItems = () => Math.floor(Math.random() * 3) + 1;
  const getRandomQuantity = () => Math.floor(Math.random() * 3) + 1;
  const getRandomProduct = () => products[Math.floor(Math.random() * products.length)];
  const getRandomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];
  const getRandomPayment = () => paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

  // Helper function to get random date within last 3 months
  const getRandomDate = () => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
    return new Date(threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime()));
  };

  // Create 15-20 orders across different users
  for (let i = 0; i < 18; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const itemCount = getRandomItems();
    const orderItems = [];
    let itemsPrice = 0;

    // Create order items
    for (let j = 0; j < itemCount; j++) {
      const product = getRandomProduct();
      const quantity = getRandomQuantity();
      const price = product.price;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: price,
        quantity: quantity
      });

      itemsPrice += price * quantity;
    }

    const shippingPrice = itemsPrice > 50 ? 0 : 9.99; // Free shipping over $50
    const taxPrice = itemsPrice * 0.08; // 8% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    const status = getRandomStatus();
    const createdDate = getRandomDate();

    const order = {
      user: user._id,
      orderItems: orderItems,
      shippingAddress: user.address,
      paymentMethod: getRandomPayment(),
      itemsPrice: Math.round(itemsPrice * 100) / 100,
      taxPrice: Math.round(taxPrice * 100) / 100,
      shippingPrice: shippingPrice,
      totalPrice: Math.round(totalPrice * 100) / 100,
      status: status,
      isPaid: status !== 'cancelled' && status !== 'pending',
      isDelivered: status === 'delivered',
      createdAt: createdDate,
      updatedAt: createdDate
    };

    // Set paid and delivered dates
    if (order.isPaid) {
      order.paidAt = new Date(createdDate.getTime() + Math.random() * (24 * 60 * 60 * 1000)); // Within 24 hours
    }

    if (order.isDelivered) {
      order.deliveredAt = new Date(createdDate.getTime() + (Math.random() * 7 + 3) * 24 * 60 * 60 * 1000); // 3-10 days later
    }

    // Add some notes for certain orders
    if (Math.random() > 0.7) {
      const notes = [
        'Customer requested express delivery',
        'Leave package at front door',
        'Call before delivery',
        'Fragile items - handle with care',
        'Business delivery - use rear entrance'
      ];
      order.notes = notes[Math.floor(Math.random() * notes.length)];
    }

    orders.push(order);
  }

  return orders;
};

const seedOrders = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing orders (optional - comment out if you want to keep existing ones)
    console.log('Clearing existing orders...');
    await Order.deleteMany({});

    // Get or create users
    console.log('Creating sample users...');
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      // Check if user already exists
      let user = await User.findOne({ email: userData.email });
      
      if (!user) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
        
        user = new User(userData);
        await user.save();
        console.log(`Created user: ${user.name} (${user.email})`);
      } else {
        console.log(`User already exists: ${user.name} (${user.email})`);
      }
      
      createdUsers.push(user);
    }

    // Get all products
    console.log('Fetching products...');
    const products = await Product.find({});
    
    if (products.length === 0) {
      console.log('No products found! Please run the seed products script first.');
      return;
    }

    console.log(`Found ${products.length} products`);    // Create sample orders
    console.log('Creating sample orders...');
    const sampleOrders = await createSampleOrders(createdUsers, products);
    
    const createdOrders = [];
    
    // Create orders one by one to ensure pre-save hooks run
    for (const orderData of sampleOrders) {
      const order = new Order(orderData);
      const savedOrder = await order.save();
      createdOrders.push(savedOrder);
      console.log(`Created order: ${savedOrder.orderNumber} - ${savedOrder.status} - $${savedOrder.totalPrice}`);
    }
    
    console.log(`\n✅ Successfully created ${createdOrders.length} sample orders!`);
    
    // Show summary
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$totalPrice' } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Orders Summary:');
    ordersByStatus.forEach(status => {
      console.log(`- ${status._id}: ${status.count} orders ($${status.totalAmount.toFixed(2)})`);
    });

    const ordersByUser = await Order.aggregate([
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
      { $group: { _id: '$user', userName: { $first: '$userInfo.name' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n👤 Orders by User:');
    ordersByUser.forEach(user => {
      console.log(`- ${user.userName[0]}: ${user.count} orders`);
    });

  } catch (error) {
    console.error('Error seeding orders:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
if (require.main === module) {
  seedOrders();
}

module.exports = { seedOrders };
