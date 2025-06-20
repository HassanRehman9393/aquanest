'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCheckoutStore } from '@/store/checkoutStore';
import { ShippingAddress } from '@/types/cart';

const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'Please enter a valid city'),
  state: z.string().min(2, 'Please enter a valid state'),
  zipCode: z.string().min(5, 'Please enter a valid ZIP code'),
  country: z.string().min(2, 'Please enter a valid country'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onContinue: () => void;
  onBack: () => void;
}

export function ShippingForm({ onContinue, onBack }: ShippingFormProps) {
  const { shippingAddress, setShippingAddress } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingAddress || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  });

  const onSubmit = (data: ShippingFormData) => {
    setShippingAddress(data as ShippingAddress);
    onContinue();
  };
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    className={`mt-1 ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    className={`mt-1 ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`mt-1 ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className={`mt-1 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Shipping Address
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address" className="text-sm font-medium">Street Address</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    className={`mt-1 ${errors.address ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    placeholder="Enter your street address"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">City</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      className={`mt-1 ${errors.city ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium">State</Label>
                    <Input
                      id="state"
                      {...register('state')}
                      className={`mt-1 ${errors.state ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-1">
                    <Label htmlFor="zipCode" className="text-sm font-medium">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      {...register('zipCode')}
                      className={`mt-1 ${errors.zipCode ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                      placeholder="Enter ZIP code"
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                  <Input
                    id="country"
                    {...register('country')}
                    className={`mt-1 ${errors.country ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                    placeholder="Enter country"
                  />
                  {errors.country && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile First */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t gap-4 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="w-full sm:w-auto flex items-center justify-center gap-2 order-2 sm:order-1"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Cart
              </Button>
              
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 order-1 sm:order-2"
                disabled={!isValid}
                size="lg"
              >
                Continue to Payment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
