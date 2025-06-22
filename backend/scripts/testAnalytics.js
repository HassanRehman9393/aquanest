const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const testAnalytics = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test analytics aggregations
    console.log('\n=== ANALYTICS TEST ===');

    // Test basic stats
    const [totalOrders, totalRevenue] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ]);

    console.log(`Total Orders: ${totalOrders}`);
    console.log(`Total Revenue: $${totalRevenue.length > 0 ? totalRevenue[0].total.toFixed(2) : '0.00'}`);

    // Test top selling products
    const topProducts = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    console.log('\n=== TOP PRODUCTS ===');
    topProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.product.name}`);
      console.log(`   Sold: ${product.totalSold} units`);
      console.log(`   Revenue: $${product.revenue.toFixed(2)}`);
    });

    // Test order status distribution
    const statusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n=== ORDER STATUS DISTRIBUTION ===');
    statusDistribution.forEach(status => {
      console.log(`${status._id}: ${status.count} orders`);
    });

    // Test daily sales data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isPaid: true
        }
      },
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

    console.log('\n=== DAILY SALES DATA (Last 30 days) ===');
    console.log(`Found ${salesData.length} days with sales`);
    salesData.slice(0, 5).forEach(day => {
      console.log(`${day._id}: ${day.orders} orders, $${day.sales.toFixed(2)}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

testAnalytics();
