const mongoose = require('mongoose');
const Product = require('../models/Product');
const productsData = require('../data/products.json');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquanest');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Upload image to Cloudinary
const uploadImageToCloudinary = async (localImagePath, productName) => {
  try {
    // Look for the image in the frontend public directory
    const imagePath = path.join(__dirname, '../../frontend/public', localImagePath);
    
    console.log(`Uploading image: ${localImagePath} for ${productName}`);
    console.log(`Looking for image at: ${imagePath}`);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.warn(`Image not found at ${imagePath}. Using placeholder.`);
      return {
        url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400&fit=crop&crop=center',
        alt: productName
      };
    }
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'aquanest/products',
      public_id: `${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto:good' }
      ]
    });
    
    console.log(`✅ Successfully uploaded ${localImagePath} to Cloudinary`);
    return {
      url: result.secure_url,
      alt: productName
    };
  } catch (error) {
    console.error(`❌ Error uploading ${localImagePath}:`, error);
    // Return placeholder image if upload fails
    return {
      url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400&fit=crop&crop=center',
      alt: productName
    };
  }
};

// Seed products with images
const seedProducts = async () => {
  try {
    console.log('🌱 Starting product seeding process...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    const productsToInsert = [];
    
    for (const productData of productsData) {
      console.log(`\n📦 Processing product: ${productData.name}`);
      
      // Upload image to Cloudinary
      const uploadedImage = await uploadImageToCloudinary(
        productData.localImagePath, 
        productData.name
      );
      
      // Prepare product data for MongoDB
      const product = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice,
        category: productData.category,
        size: productData.size,
        volume: productData.volume,
        images: [uploadedImage], // Array of image objects
        stock: productData.stock,
        features: productData.features || [],
        isActive: productData.isActive !== false,
        rating: productData.rating || 0,
        reviews: productData.reviews || 0,
        popular: productData.popular || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      productsToInsert.push(product);
    }
    
    // Insert all products
    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`\n✅ Successfully seeded ${insertedProducts.length} products!`);
    
    // Display inserted products
    console.log('\n📋 Inserted Products:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (ID: ${product._id})`);
      console.log(`  Image: ${product.images[0]?.url}`);
      console.log(`  Price: $${product.price}`);
      console.log(`  Stock: ${product.stock}`);
    });
    
    console.log('\n🎉 Product seeding completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your frontend to fetch products from the API instead of using static data');
    console.log('2. Test placing orders with these real products');
    console.log('3. Verify orders are saved to the database');
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

// Run the seeding process
const runSeed = async () => {
  try {
    await connectDB();
    await seedProducts();
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedProducts, uploadImageToCloudinary };
