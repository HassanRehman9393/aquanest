'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Cart Items ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.product.description}
                    </p>
                    {item.product.volume && (
                      <Badge variant="secondary" className="mt-1">
                        {item.product.volume}
                      </Badge>
                    )}
                    {item.selectedOptions && (
                      <div className="mt-2 text-sm text-gray-500">
                        {item.selectedOptions.size && (
                          <span>Size: {item.selectedOptions.size}</span>
                        )}
                        {item.selectedOptions.subscription && (
                          <span className="ml-2">
                            Subscription: {item.selectedOptions.subscription}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.product.price)} each
                    </p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {shipping === 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">
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
  );
}
