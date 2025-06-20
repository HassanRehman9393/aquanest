'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Calendar, ArrowRight, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { formatCurrency } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface OrderConfirmationProps {
  onContinue: () => void;
}

export function OrderConfirmation({ onContinue }: OrderConfirmationProps) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  
  const { shippingAddress, paymentMethod, resetCheckout } = useCheckoutStore();
  const { clearCart } = useCartStore();  // Create order when component mounts if we don't have one
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Try to get order from session storage first (created during payment)
    const savedOrder = sessionStorage.getItem('currentOrder');
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        setOrder(parsedOrder);
        // Clear the session storage
        sessionStorage.removeItem('currentOrder');
          // Show success message immediately but don't clear cart/checkout automatically
        toast.success('Order placed successfully!');
      } catch (error) {
        console.error('Failed to parse order from session storage:', error);
      }
    } else {
      // Set a timeout to create fallback order if nothing happens
      timeoutId = setTimeout(() => {
        // Fallback: create a mock order for demo purposes
        const mockOrder = {
          id: `AQ${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
          date: new Date(),
          total: 89.97,
          subtotal: 79.98,
          tax: 6.40,
          shipping: 3.59,
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          items: [
            {
              id: '1',
              name: 'Premium Water Bottles - 16oz',
              quantity: 2,
              price: 12.99,
              image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
            },
            {
              id: '2', 
              name: '5-Gallon Water Jug',
              quantity: 1,
              price: 32.99,
              image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400',
            }
          ]
        };
        setOrder(mockOrder);
          // Show success message but don't clear cart/checkout automatically
        toast.success('Order placed successfully!');
      }, 1000); // Wait 1 second before showing fallback
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const confettiAnimation = {
    initial: { scale: 0, rotate: 0 },
    animate: { 
      scale: [0, 1.2, 1], 
      rotate: [0, 180, 360],
    }
  };

  const slideUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
  };
  const handleContinue = () => {
    // Clear cart and reset checkout only when user manually continues
    clearCart();
    resetCheckout();
    onContinue();
  };

  const handleViewTracking = () => {
    if (order?.trackingNumber) {
      // Clear cart and reset checkout before navigating
      clearCart();
      resetCheckout();
      router.push(`/tracking?tracking=${order.trackingNumber}&order=${order.id}`);
    }
  };
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Processing your order...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">This will only take a moment</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}      <motion.div 
        initial="initial"
        animate="animate"
        className="text-center mb-8"
      >
        <motion.div 
          variants={confettiAnimation} 
          className="mb-4"
          transition={{ duration: 0.8, ease: "easeOut", times: [0, 0.6, 1] }}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        </motion.div>
        
        <motion.div 
          variants={slideUp}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Order Number</span>
                <Badge variant="secondary" className="font-mono">
                  {order.id}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Order Date</span>
                <span className="font-medium">
                  {format(order.date, 'MMMM d, yyyy')}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                <span className="font-medium capitalize">
                  {paymentMethod?.type === 'cash_on_delivery' ? 'Cash on Delivery' : paymentMethod?.type}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">
                    Estimated Delivery: {format(order.estimatedDelivery, 'EEEE, MMMM d')}
                  </span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t">
                <Button variant="outline" className="w-full justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                
                <Button onClick={handleViewTracking} variant="outline" className="w-full justify-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Your Order
                </Button>
                
                <Button onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View Order History
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {shippingAddress && (
                <div className="space-y-2">
                  <p className="font-medium">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {shippingAddress.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {shippingAddress.country}
                  </p>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Contact: {shippingAddress.phone}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Email: {shippingAddress.email}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Order Processing
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We'll prepare your order for shipment
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Shipment & Tracking
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You'll receive tracking information via email
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Delivery
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your order arrives at your doorstep
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Review Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Love AquaNest?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Share your experience and help others discover pure, fresh water
                  </p>
                </div>
              </div>
              <Button variant="outline" className="whitespace-nowrap">
                Leave a Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
