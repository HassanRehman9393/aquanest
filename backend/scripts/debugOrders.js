const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
require('dotenv').config();

const debugOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check first order structure
    const firstOrder = await Order.findOne().populate('orderItems.product', 'name');
    console.log('\n=== FIRST ORDER STRUCTURE ===');
    console.log('Order ID:', firstOrder._id);
    console.log('isPaid:', firstOrder.isPaid);
    console.log('Status:', firstOrder.status);
    console.log('Total Price:', firstOrder.totalPrice);
    console.log('Order Items Count:', firstOrder.orderItems.length);
    
    if (firstOrder.orderItems.length > 0) {
      console.log('\nFirst Order Item:');
      console.log('Product ID:', firstOrder.orderItems[0].product);
      console.log('Product Name:', firstOrder.orderItems[0].name);
      console.log('Quantity:', firstOrder.orderItems[0].quantity);
      console.log('Price:', firstOrder.orderItems[0].price);
    }

    // Check payment status distribution
    const paymentStats = await Order.aggregate([
      {
        $group: {
          _id: '$isPaid',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n=== PAYMENT STATUS ===');
    paymentStats.forEach(stat => {
      console.log(`isPaid: ${stat._id} - ${stat.count} orders`);
    });

    // Check orders without isPaid filter
    const allOrders = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n=== ALL ORDERS BY DATE ===');
    console.log(`Found ${allOrders.length} days with orders`);
    allOrders.slice(0, 5).forEach(day => {
      console.log(`${day._id}: ${day.orders} orders, $${day.sales.toFixed(2)}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

debugOrders();
