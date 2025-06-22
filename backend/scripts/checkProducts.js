const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/aquanest');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const checkProducts = async () => {
  try {
    await connectDB();
    
    const products = await Product.find({});
    
    console.log('📊 DATABASE PRODUCT SUMMARY:');
    console.log('============================');
    console.log(`Total products in database: ${products.length}`);
    
    if (products.length === 0) {
      console.log('❌ No products found in database!');
      console.log('💡 Run "npm run seed:products" to add products');
    } else {
      console.log('\n📦 Products in database:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   ID: ${product._id}`);
        console.log(`   Price: $${product.price}`);
        console.log(`   Stock: ${product.stock}`);
        console.log(`   Image: ${product.images[0]?.url || 'No image'}`);
        console.log('');
      });
      
      console.log('✅ Products are ready for orders!');
      console.log('💡 Now update your frontend to fetch these products from the API');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking products:', error);
    process.exit(1);
  }
};

checkProducts();
