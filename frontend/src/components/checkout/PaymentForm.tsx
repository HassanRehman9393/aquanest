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
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <Label className="text-base font-semibold">Payment Method</Label>
                  <RadioGroup
                    value={selectedPaymentType}
                    onValueChange={(value) => register('type').onChange({ target: { value } })}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer">
                        PayPal
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cash_on_delivery" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer">
                        Cash on Delivery
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
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Your payment information is secure and encrypted
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        {...register('cardholderName')}
                        placeholder="John Doe"
                        className={errors.cardholderName ? 'border-red-500' : ''}
                      />
                      {errors.cardholderName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.cardholderName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        {...register('cardNumber')}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        onChange={(e) => {
                          e.target.value = formatCardNumber(e.target.value);
                          register('cardNumber').onChange(e);
                        }}
                        className={errors.cardNumber ? 'border-red-500' : ''}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.cardNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          {...register('expiryDate')}
                          placeholder="MM/YY"
                          maxLength={5}
                          onChange={(e) => {
                            e.target.value = formatExpiryDate(e.target.value);
                            register('expiryDate').onChange(e);
                          }}
                          className={errors.expiryDate ? 'border-red-500' : ''}
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.expiryDate.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="cvv" className="flex items-center gap-1">
                          CVV
                          <Lock className="h-3 w-3" />
                        </Label>
                        <Input
                          id="cvv"
                          {...register('cvv')}
                          placeholder="123"
                          maxLength={4}
                          type="password"
                          className={errors.cvv ? 'border-red-500' : ''}
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
                    className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                  >
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      You will be redirected to PayPal to complete your payment.
                    </p>
                  </motion.div>
                )}

                {/* Cash on Delivery */}
                {selectedPaymentType === 'cash_on_delivery' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Pay with cash when your order is delivered to your door.
                    </p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Shipping
                  </Button>
                  
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    disabled={!isValid || isProcessing}
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

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(total)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
