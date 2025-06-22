const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
require('dotenv').config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check users
    const users = await User.find({}).select('name email role');
    console.log('\n=== USERS ===');
    console.log(`Total users: ${users.length}`);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });

    // Check products
    const products = await Product.find({}).select('name category price');
    console.log('\n=== PRODUCTS ===');
    console.log(`Total products: ${products.length}`);
    products.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - $${product.price}`);
    });

    // Check orders
    const orders = await Order.find({}).select('orderNumber status totalPrice user').populate('user', 'name email');
    console.log('\n=== ORDERS ===');
    console.log(`Total orders: ${orders.length}`);
    orders.forEach(order => {
      console.log(`- ${order.orderNumber} - ${order.status} - $${order.totalPrice} - ${order.user?.name || 'Unknown User'}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkData();
