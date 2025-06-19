const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: {
      values: ['bottle', 'gallon', 'dispenser', 'accessory'],
      message: 'Category must be one of: bottle, gallon, dispenser, accessory'
    }
  },
  size: {
    type: String,
    required: function() {
      return this.category === 'bottle' || this.category === 'gallon';
    }
  },
  volume: {
    type: Number, // in liters
    required: function() {
      return this.category === 'bottle' || this.category === 'gallon';
    }
  },
  images: [{
    url: String,
    alt: String
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  features: [String],
  specifications: {
    material: String,
    dimensions: String,
    weight: String,
    color: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  discount: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    validUntil: Date
  }
}, {
  timestamps: true
});

// Calculate discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount.percentage > 0 && this.discount.validUntil > Date.now()) {
    return this.price * (1 - this.discount.percentage / 100);
  }
  return this.price;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
