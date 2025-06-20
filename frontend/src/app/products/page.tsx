'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, ShoppingCart, Droplets, Package, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductBentoGrid, ProductBentoCard } from '@/components/ui/product-bento-grid';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'bottles', label: 'Water Bottles' },
    { value: 'gallons', label: 'Water Gallons' },
    { value: 'dispensers', label: 'Water Dispensers' }
  ];

  const sizeOptions = [
    { value: 'all', label: 'All Sizes' },
    { value: '12oz', label: '12 oz Bottles' },
    { value: '16oz', label: '16 oz Bottles' },
    { value: '1L', label: '1 Liter Bottles' },
    { value: '3gal', label: '3 Gallon' },
    { value: '5gal', label: '5 Gallon' },
    { value: '10gal', label: '10 Gallon' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-10', label: 'Under $10' },
    { value: '10-25', label: '$10 - $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50+', label: '$50+' }
  ];  const products = [
    {
      id: 1,
      name: 'Premium Water Bottles - 12oz',
      description: 'Pure, refreshing water in convenient 12oz bottles. Perfect for on-the-go hydration.',
      price: 8.99,
      originalPrice: 10.99,
      rating: 4.8,
      reviews: 156,
      category: 'bottles',
      size: '12oz (12 pack)',
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400&fit=crop&crop=center',
      inStock: true,
      popular: true
    },
    {
      id: 2,
      name: 'Premium Water Bottles - 16oz',
      description: 'Larger 16oz bottles for extended hydration throughout your day.',
      price: 12.99,
      originalPrice: null,
      rating: 4.9,
      reviews: 203,
      category: 'bottles',
      size: '16oz (8 pack)',
      image: 'https://images.unsplash.com/photo-1609840114113-ba0e4cb995c8?w=600&h=400&fit=crop&crop=center',
      inStock: true,
      popular: false
    },
    {
      id: 3,
      name: 'Premium Water Bottles - 1L',
      description: 'Large 1-liter bottles perfect for home, office, or extended outdoor activities.',
      price: 15.99,
      originalPrice: 18.99,
      rating: 4.7,
      reviews: 89,
      category: 'bottles',
      size: '1 Liter (6 pack)',
      image: 'https://images.unsplash.com/photo-1625897442196-08958bcca13e?w=600&h=400&fit=crop&crop=center',
      inStock: true,
      popular: true
    },
    {
      id: 4,
      name: '3-Gallon Water Jug',
      description: 'Convenient 3-gallon water jug perfect for small families and offices.',
      price: 24.99,
      originalPrice: null,
      rating: 4.6,
      reviews: 134,
      category: 'gallons',
      size: '3 Gallon',
      image: 'https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?w=600&h=400&fit=crop&crop=center',
      inStock: true,
      popular: false
    },
    {
      id: 5,
      name: '5-Gallon Water Jug',
      description: 'Standard 5-gallon water jug, ideal for homes and small businesses.',
      price: 32.99,
      originalPrice: 35.99,
      rating: 4.8,
      reviews: 267,
      category: 'gallons',
      size: '5 Gallon',
      image: 'https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?w=600&h=400&fit=crop&crop=center',
      inStock: true,
      popular: true
    },
    {
      id: 6,
      name: '10-Gallon Water Jug',
      description: 'Large capacity 10-gallon jug for high-consumption environments.',
      price: 58.99,
      originalPrice: null,
      rating: 4.5,
      reviews: 112,
      category: 'gallons',
      size: '10 Gallon',
      image: 'https://images.unsplash.com/photo-1619440947946-91b2b1a73439?w=600&h=400&fit=crop&crop=center',
      inStock: true,
      popular: false
    },
    {
      id: 7,
      name: 'Countertop Water Dispenser',
      description: 'Compact countertop dispenser with hot and cold water options. Perfect for small spaces.',
      price: 149.99,
      originalPrice: 179.99,
      rating: 4.7,
      reviews: 89,
      category: 'dispensers',
      size: 'Countertop',
      image: 'https://images.unsplash.com/photo-1596510915080-e3e5a99e1e2e?w=600&h=400&fit=crop&crop=center',
      inStock: true,
      popular: true
    },
    {
      id: 8,
      name: 'Floor Standing Water Dispenser',
      description: 'Premium floor-standing dispenser with advanced filtration and temperature control.',
      price: 299.99,
      originalPrice: 349.99,
      rating: 4.9,
      reviews: 156,
      category: 'dispensers',
      size: 'Floor Standing',
      image: 'https://images.unsplash.com/photo-1572384780834-12ac4626fc64?w=600&h=400&fit=crop&crop=center',
      inStock: true,
      popular: true
    },
    {
      id: 9,
      name: 'Commercial Water Dispenser',
      description: 'Heavy-duty commercial grade dispenser designed for high-traffic environments.',
      price: 599.99,
      originalPrice: null,
      rating: 4.8,
      reviews: 67,
      category: 'dispensers',
      size: 'Commercial Grade',
      image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=600&h=400&fit=crop&crop=center',
      inStock: true,
      popular: false
    }
  ];
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSize = selectedSize === 'all' || product.size?.includes(selectedSize);
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      if (priceRange === '0-10') matchesPrice = product.price < 10;
      else if (priceRange === '10-25') matchesPrice = product.price >= 10 && product.price <= 25;
      else if (priceRange === '25-50') matchesPrice = product.price >= 25 && product.price <= 50;
      else if (priceRange === '50+') matchesPrice = product.price > 50;
    }
      return matchesSearch && matchesCategory && matchesSize && matchesPrice;
  });

  const getProductIcon = (category: string) => {
    switch (category) {
      case 'bottles':
        return Droplets;
      case 'gallons':
        return Package;
      case 'dispensers':
        return Recycle;
      default:
        return Droplets;
    }  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header Section */}
      <section className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center space-y-4"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Our Products
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Discover our premium selection of water products, each carefully crafted for purity and taste
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  {sizeOptions.map((size) => (
                    <SelectItem key={size.value} value={size.value} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700">
                      {range.label}
                    </SelectItem>
                  ))}                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</div>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange('all');
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Clear Filters
              </Button>
            </div>          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <ProductBentoGrid>
                {filteredProducts.map((product) => (
                  <ProductBentoCard
                    key={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    category={product.category}
                    size={product.size}
                    Icon={getProductIcon(product.category)}
                    cta="Add to Cart"
                    background={
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    }
                  />
                ))}
              </ProductBentoGrid>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
