'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Settings, CreditCard, MapPin, Bell, Shield, Heart, Star, Calendar, Truck, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

// Mock order data - in a real app, this would come from an API
const mockOrders = [
  {
    id: 'AQ123456',
    date: new Date('2024-01-15'),
    status: 'delivered',
    total: 89.97,
    items: [
      { name: 'Premium Water Bottles - 16oz', quantity: 2, price: 12.99 },
      { name: '5-Gallon Water Jug', quantity: 2, price: 32.99 }
    ],
    estimatedDelivery: new Date('2024-01-18'),
    trackingNumber: 'TRK789012345'
  },
  {
    id: 'AQ123457',
    date: new Date('2024-01-10'),
    status: 'shipped',
    total: 64.98,
    items: [
      { name: 'Premium Water Bottles - 12oz', quantity: 3, price: 8.99 },
      { name: '3-Gallon Water Jug', quantity: 1, price: 24.99 }
    ],
    estimatedDelivery: new Date('2024-01-13'),
    trackingNumber: 'TRK789012346'
  },
  {
    id: 'AQ123458',
    date: new Date('2024-01-05'),
    status: 'processing',
    total: 149.99,
    items: [
      { name: 'Countertop Water Dispenser', quantity: 1, price: 149.99 }
    ],
    estimatedDelivery: new Date('2024-01-08')
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Delivered</Badge>;
    case 'shipped':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Shipped</Badge>;
    case 'processing':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Processing</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="flex items-center gap-6"
          >
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.name || 'User Profile'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Premium Member
                </Badge>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">4.0</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-96">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order History
                </h2>
                <Button variant="outline">
                  View All Orders
                </Button>
              </div>

              <div className="grid gap-6">
                {mockOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              Order #{order.id}
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Placed on {format(order.date, 'MMMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              Items ({order.items.length})
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Info */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              {order.status === 'delivered' ? (
                                <>
                                  <Package className="h-4 w-4" />
                                  <span className="text-sm">
                                    Delivered on {format(order.estimatedDelivery, 'MMM d, yyyy')}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Truck className="h-4 w-4" />
                                  <span className="text-sm">
                                    Est. delivery: {format(order.estimatedDelivery, 'MMM d, yyyy')}
                                  </span>
                                </>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              {order.trackingNumber && (
                                <Button variant="outline" size="sm">
                                  <Truck className="h-4 w-4 mr-2" />
                                  Track Order
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Full Name
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Email Address
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.email || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Phone Number
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      +1 (555) 123-4567
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Favorite Products
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      Premium Water Bottles - 16oz
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Delivery Frequency
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      Weekly
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Subscription Status
                    </label>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Saved Addresses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No addresses saved
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Add an address to make checkout faster
                  </p>
                  <Button>
                    Add New Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Order Updates</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Promotional Emails</span>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS Notifications</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Enabled
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Login Activity
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
