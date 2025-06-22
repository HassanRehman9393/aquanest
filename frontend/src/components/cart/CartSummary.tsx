'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/SafeImage';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';

interface CartSummaryProps {
  onContinue: () => void;
}

export function CartSummary({ onContinue }: CartSummaryProps) {
  const { 
    items, 
    subtotal, 
    shipping, 
    tax, 
    total, 
    updateQuantity, 
    removeItem 
  } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add some products to get started!
        </p>
      </div>
    );
  }
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                Cart Items ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Mobile: Product Image and Details Container */}
                    <div className="flex items-start gap-4 w-full sm:flex-1">                      {/* Product Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        <SafeImage
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2">
                          {item.product.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                        {item.product.volume && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {item.product.volume}
                          </Badge>
                        )}
                        {item.selectedOptions && (
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            {item.selectedOptions.size && (
                              <div>Size: {item.selectedOptions.size}</div>
                            )}
                            {item.selectedOptions.subscription && (
                              <div>Subscription: {item.selectedOptions.subscription}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile: Controls and Price Container */}
                    <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-4 sm:gap-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.product.price)} each
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800 lg:sticky lg:top-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Subtotal</span>
                  <span className="font-medium text-sm">{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Shipping</span>
                  <span className="font-medium text-sm">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Tax</span>
                  <span className="font-medium text-sm">{formatCurrency(tax)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {shipping === 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium">
                      🎉 You qualify for free shipping!
                    </p>
                  </div>
                )}

                <Button 
                  onClick={onContinue}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Continue to Shipping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
