'use client';

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Search, Filter, Star, ShoppingCart, Droplets, Package, Recycle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductBentoGrid, ProductBentoCard } from '@/components/ui/product-bento-grid';
import { SafeImage } from '@/components/ui/SafeImage';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types/cart';
import { productsAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useDebounce, useLazyLoad, usePerformanceMonitor } from '@/hooks/usePerformanceOptimization';

// Memoized product card component for better performance
const ProductCard = memo(({ product, onAddToCart }: { 
  product: any; 
  onAddToCart: (product: any) => void;
}) => {
  const { ref, isVisible } = useLazyLoad(0.1);

  if (!isVisible) {
    return (
      <div ref={ref} className="h-96 bg-gray-100 rounded-lg animate-pulse" />
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <SafeImage
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
              {product.badge}
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-blue-600">${product.price}</span>
            {product.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
              </div>
            )}
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-2 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default function ProductsPage() {
  usePerformanceMonitor('ProductsPage');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Debounced search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Pagination settings
  const PRODUCTS_PER_PAGE = 12;
  
  // Optimize cart store usage by only subscribing to needed functions
  const addItem = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);
  const { isAuthenticated } = useAuth();
  // Memoized add to cart handler
  const handleAddToCart = useCallback((product: any) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart', {
        action: {
          label: 'Log In',
          onClick: () => window.location.href = '/auth/login?redirect=/products',
        },
      });
      return;
    }

    if (!product.name || !product.description || typeof product.price !== 'number') {
      toast.error('Invalid product data');
      return;
    }

    // Validate and set product image
    let productImage = 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400&fit=crop&crop=center';
    
    if (product.image) {
      try {
        // Validate URL
        new URL(product.image);
        productImage = product.image;
      } catch (error) {
        console.warn('Invalid image URL for product:', product.name, product.image);
        // Keep default image
      }
    }

    const cartProduct: Product = {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      image: productImage,
      category: product.category === 'bottles' || product.category === 'gallons' ? 'water' : 'accessories',
      inStock: product.inStock || false,
      volume: product.size || '',
      features: product.category === 'dispensers' ? ['Advanced Features'] : ['BPA-Free', 'Purified Water']
    };

    addItem(cartProduct, 1);
    
    // Show success toast
    toast.success(`${product.name} added to cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => openCart(),
      },
    });
  }, [isAuthenticated, addItem, openCart]);

  // Fetch products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Fetching products from API...');
        
        const response = await productsAPI.getProducts({});
        console.log('✅ Products fetched successfully:', response.data.length);
        
        // Transform API products to match frontend format
        const transformedProducts = response.data.map((product: any) => ({
          id: product._id, // Use MongoDB ObjectId as ID
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || null,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0,
          category: product.category,
          size: product.size,
          image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400&fit=crop&crop=center',
          inStock: product.stock > 0,
          popular: product.popular || false,
          stock: product.stock,
          volume: product.volume,
          features: product.features || []
        }));
        
        setProducts(transformedProducts);
        console.log('📦 Products transformed and set:', transformedProducts.length);      } catch (error: any) {
        console.error('❌ Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        toast.error('Failed to load products from server');
        
        // Set empty products array instead of fallback
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };    fetchProducts();
  }, []);

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
    { value: '50+', label: '$50+' }  ];
  // Memoize filtered products to prevent unnecessary recalculations with debounced search
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      // Map frontend category values to backend categories
      let categoryFilter = selectedCategory;
      if (selectedCategory === 'bottles') categoryFilter = 'bottle';
      if (selectedCategory === 'gallons') categoryFilter = 'gallon';
      if (selectedCategory === 'dispensers') categoryFilter = 'dispenser';
      
      const matchesCategory = selectedCategory === 'all' || product.category === categoryFilter;
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
  }, [products, debouncedSearchTerm, selectedCategory, selectedSize, priceRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedSize, priceRange]);
  const getProductIcon = (category: string) => {
    switch (category) {
      case 'bottle':
      case 'bottles':
        return Droplets;
      case 'gallon':
      case 'gallons':
        return Package;
      case 'dispenser':
      case 'dispensers':
        return Recycle;
      default:
        return Droplets;
    }
  };

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
      </section>      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
              <div className="text-lg text-gray-600 dark:text-gray-300">Loading products...</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Fetching fresh products from our database</div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-500 dark:text-red-400 text-lg mb-4">⚠️ {error}</div>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Retry Loading
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                {products.length === 0 ? 'No products available at the moment.' : 'No products found matching your criteria.'}
              </div>
              {products.length > 0 && (
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange('all');
                    setSelectedSize('all');
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Clear Filters
                </Button>
              )}
            </div>          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <div className="mb-6 text-center">                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                  {totalPages > 1 && (
                    <span className="ml-2">
                      (Page {currentPage} of {totalPages})
                    </span>                  )}
                </div>
              </div><ProductBentoGrid>
                {paginatedProducts.map((product, index) => (
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
                    onCtaClick={() => handleAddToCart(product)}                    background={
                      <SafeImage
                        src={product.image}
                        alt={product.name}
                        fill
                        loading="lazy"
                        className="object-cover"
                      />
                    }
                  />
                ))}
              </ProductBentoGrid>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10 h-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4"
                  >
                    Next
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
