'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/SafeImage';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export function CartSidebar() {
  const {
    items,
    isOpen,
    total,
    subtotal,
    shipping,
    tax,
    itemCount,
    closeCart,
    updateQuantity,
    removeItem
  } = useCartStore();
  
  const { isAuthenticated } = useAuth();

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error('Please log in to proceed to checkout');
      closeCart();
      // Redirect to login with checkout redirect
      window.location.href = '/auth/login?redirect=/checkout';
      return;
    }
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeCart}
          />          {/* Cart Sidebar - Mobile Optimized */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header - Mobile Optimized */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Shopping Cart
                </h2>
                {itemCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCart}
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>            {/* Cart Content - Mobile Optimized */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Add some products to get started
                </p>
                <Button
                  onClick={closeCart}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* Cart Items - Mobile Optimized */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >                        {/* Product Image - Mobile Optimized */}
                        <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-md overflow-hidden bg-white flex-shrink-0">
                          <SafeImage
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details - Mobile Optimized */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight">
                            {item.product.name}
                          </h4>
                          {item.product.volume && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {item.product.volume}
                            </p>
                          )}
                          {item.selectedOptions?.subscription && (
                            <Badge variant="outline" className="mt-1 text-xs py-0 px-1">
                              {item.selectedOptions.subscription}
                            </Badge>
                          )}
                          
                          {/* Quantity Controls - Mobile Optimized */}
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Price and Remove - Mobile Optimized */}
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Cart Summary - Mobile Optimized */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      Shipping
                    </span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>

                  {/* Free shipping indicator */}
                  {shipping > 0 && (
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Free shipping on orders over $50
                    </div>
                  )}

                  {/* Tax */}
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-base sm:text-lg font-semibold pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>                  {/* Checkout Button - Mobile Optimized */}
                  <Link href="/checkout" onClick={handleCheckoutClick}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm sm:text-base font-semibold">
                      {isAuthenticated ? 'Proceed to Checkout' : 'Log In to Checkout'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
