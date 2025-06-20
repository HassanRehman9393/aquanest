'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Droplets, Package, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types/cart';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Water Bottles - 16oz',
    description: 'Pure, refreshing water in convenient 16oz bottles. Perfect for on-the-go hydration.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1609840114113-ba0e4cb995c8?w=600&h=400&fit=crop&crop=center',
    category: 'water',
    inStock: true,
    volume: '16oz (8 pack)',
    features: ['BPA-Free', 'Eco-Friendly', 'Natural Spring Water']
  },
  {
    id: '2',
    name: '5-Gallon Water Jug',
    description: 'Standard 5-gallon water jug, ideal for homes and small businesses.',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?w=600&h=400&fit=crop&crop=center',
    category: 'water',
    inStock: true,
    volume: '5 Gallon',
    features: ['Reusable', 'BPA-Free', 'Natural Spring Water']
  },
  {
    id: '3',
    name: 'Countertop Water Dispenser',
    description: 'Compact countertop dispenser with hot and cold water options. Perfect for small spaces.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1635221875522-f7db5a8a5a5c?w=600&h=400&fit=crop&crop=center',
    category: 'accessories',
    inStock: true,
    features: ['Hot & Cold Water', 'Compact Design', 'Energy Efficient']
  },
  {
    id: '4',
    name: 'Premium Water Bottles - 12oz',
    description: 'Pure, refreshing water in convenient 12oz bottles. Perfect for lunch boxes and short trips.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400&fit=crop&crop=center',
    category: 'water',
    inStock: true,
    volume: '12oz (12 pack)',
    features: ['BPA-Free', 'Eco-Friendly', 'Purified Water']
  }
];

export default function CartDemoPage() {
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    
    // Show success toast
    toast.success(`${product.name} added to cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => openCart(),
      },
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header Section */}
      <section className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              Shopping Cart Demo
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Test our complete shopping cart experience with add-to-cart animations, cart management, and checkout flow
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto"
            >
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">
                  Click on any product to add it to your cart and test the full checkout process!
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {demoProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {product.category === 'water' ? 'Water' : 'Accessory'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </CardTitle>
                    {product.volume && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {product.volume}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {product.features && (
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleAddToCart(product)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 group-hover:scale-105 transition-transform"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              How to Test the Shopping Cart
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">1. Add Products</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click "Add to Cart" on any product. Watch for the toast notification and cart icon update.
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">2. View Cart</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the cart icon in the header or "View Cart" in the toast to open the cart sidebar.
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                  <Droplets className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">3. Checkout</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Proceed through the multi-step checkout: shipping, payment, and confirmation.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Features to Test:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div>• Add/remove items from cart</div>
                <div>• Update quantities</div>
                <div>• Persistent cart storage</div>
                <div>• Shipping form validation</div>
                <div>• Payment form with different methods</div>
                <div>• Order confirmation with animations</div>
                <div>• Toast notifications</div>
                <div>• Responsive cart sidebar</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
