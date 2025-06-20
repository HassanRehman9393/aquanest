'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { CartSummary } from '@/components/cart/CartSummary';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 'cart', title: 'Cart', icon: ShoppingBag },
  { id: 'shipping', title: 'Shipping', icon: Truck },
  { id: 'payment', title: 'Payment', icon: CreditCard },
  { id: 'confirmation', title: 'Confirmation', icon: CheckCircle },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount } = useCartStore();
  const { step, setStep } = useCheckoutStore();
  
  const currentStepIndex = steps.findIndex(s => s.id === step);

  // Don't redirect to empty cart if we're on confirmation step
  // or if there's a saved order in session storage (payment just completed)
  const hasSavedOrder = typeof window !== 'undefined' && sessionStorage.getItem('currentOrder');
  
  if (itemCount === 0 && step !== 'confirmation' && !hasSavedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some products to get started with your order.
          </p>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }const renderStepContent = () => {
    switch (step) {
      case 'cart':
        return <CartSummary onContinue={() => setStep('shipping')} />;
      case 'shipping':
        return <ShippingForm onContinue={() => setStep('payment')} onBack={() => setStep('cart')} />;
      case 'payment':
        return <PaymentForm onContinue={() => setStep('confirmation')} onBack={() => setStep('shipping')} />;
      case 'confirmation':
        return (
          <OrderConfirmation 
            onContinue={() => {
              // Navigate to profile page and reset everything
              router.push('/profile');
            }} 
          />
        );
      default:
        return <CartSummary onContinue={() => setStep('shipping')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Checkout
              </h1>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={stepItem.id} className="flex items-center">
                    <div className={`
                      relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                      ${isActive 
                        ? 'border-blue-600 bg-blue-600 text-white' 
                        : isCompleted 
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                      }
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-blue-600 dark:text-blue-400' 
                        : isCompleted ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {stepItem.title}
                      </p>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`
                        w-16 h-0.5 ml-6 transition-colors
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                      `} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
