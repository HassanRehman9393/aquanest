const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const checkProductImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');    const products = await Product.find({}).select('name images category');
    console.log('\n=== PRODUCT IMAGES ===');
    console.log(`Total products: ${products.length}`);
    
    products.forEach(product => {
      console.log(`\n- ${product.name} (${product.category})`);
      const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;
      console.log(`  Image URL: ${imageUrl || 'NOT SET'}`);
      console.log(`  Is Cloudinary: ${imageUrl ? imageUrl.includes('res.cloudinary.com') : false}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkProductImages();
