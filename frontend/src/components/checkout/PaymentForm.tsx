'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight, ArrowLeft, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { PaymentMethod } from '@/types/cart';
import { formatCurrency } from '@/lib/utils';

const paymentSchema = z.object({
  type: z.enum(['card', 'paypal', 'cash_on_delivery']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional(),
}).refine((data) => {
  if (data.type === 'card') {
    return !!(data.cardNumber && data.expiryDate && data.cvv && data.cardholderName);
  }
  return true;
}, {
  message: 'All card fields are required when paying by card',
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onContinue: () => void;
  onBack: () => void;
}

export function PaymentForm({ onContinue, onBack }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { paymentMethod, setPaymentMethod, setProcessing, shippingAddress } = useCheckoutStore();
  const { total, subtotal, tax, shipping, items } = useCartStore();
  const { createOrder } = useOrderStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentMethod || {
      type: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
    },
  });

  const selectedPaymentType = watch('type');  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentMethod(data as PaymentMethod);
      
      // Create the order and save to session storage
      if (shippingAddress && items.length > 0) {
        const newOrder = createOrder(
          items,
          shippingAddress,
          data as PaymentMethod,
          { total, subtotal, tax, shipping }
        );
        
        // Save order to session storage for the confirmation page
        sessionStorage.setItem('currentOrder', JSON.stringify(newOrder));
      }
      
      // Don't clear cart here - let the confirmation page handle it
      onContinue();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <Label className="text-base font-semibold">Payment Method</Label>
                  <RadioGroup
                    value={selectedPaymentType}
                    onValueChange={(value) => register('type').onChange({ target: { value } })}
                    className="mt-3 space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm sm:text-base">Credit/Debit Card</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer flex-1">
                        <span className="text-sm sm:text-base">PayPal</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <RadioGroupItem value="cash_on_delivery" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer flex-1">
                        <span className="text-sm sm:text-base">Cash on Delivery</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Details */}
                {selectedPaymentType === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Shield className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium">
                          Your payment information is secure and encrypted
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardholderName" className="text-sm font-medium">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        {...register('cardholderName')}
                        placeholder="John Doe"
                        className={`mt-1 ${errors.cardholderName ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      />
                      {errors.cardholderName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.cardholderName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-medium">Card Number</Label>
                      <Input                        id="cardNumber"
                        {...register('cardNumber')}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        onChange={(e) => {
                          e.target.value = formatCardNumber(e.target.value);
                          register('cardNumber').onChange(e);
                        }}
                        className={`mt-1 font-mono ${errors.cardNumber ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.cardNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          {...register('expiryDate')}
                          placeholder="MM/YY"
                          maxLength={5}
                          onChange={(e) => {
                            e.target.value = formatExpiryDate(e.target.value);
                            register('expiryDate').onChange(e);
                          }}
                          className={`mt-1 font-mono ${errors.expiryDate ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.expiryDate.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="cvv" className="flex items-center gap-1 text-sm font-medium">
                          CVV
                          <Lock className="h-3 w-3" />
                        </Label>
                        <Input
                          id="cvv"
                          {...register('cvv')}
                          placeholder="123"
                          maxLength={4}
                          type="password"
                          className={`mt-1 font-mono ${errors.cvv ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                        />
                        {errors.cvv && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.cvv.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PayPal */}
                {selectedPaymentType === 'paypal' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                  >
                    <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                      You will be redirected to PayPal to complete your payment.
                    </p>
                  </motion.div>
                )}

                {/* Cash on Delivery */}
                {selectedPaymentType === 'cash_on_delivery' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                      Pay with cash when your order is delivered to your door.
                    </p>
                  </motion.div>
                )}

                {/* Action Buttons - Mobile First */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t gap-4 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={isProcessing}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 order-2 sm:order-1"
                    size="lg"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Shipping
                  </Button>
                  
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 order-1 sm:order-2"
                    disabled={!isValid || isProcessing}
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Order
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary - Mobile First */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <Card className="shadow-lg border-0 bg-white dark:bg-slate-800 lg:sticky lg:top-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Order Total</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(total)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Including taxes and shipping
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
