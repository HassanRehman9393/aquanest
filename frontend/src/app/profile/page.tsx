'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Settings, CreditCard, MapPin, Bell, Shield, Heart, Star, Calendar, Truck, Eye, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStore } from '@/store/userStore';
import { useOrderStore } from '@/store/orderStore';
import { Order } from '@/types/cart';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
  const router = useRouter();
  
  // Get data from stores
  const { 
    stats, 
    statsLoading, 
    fetchStats, 
    cancelOrder, 
    refresh 
  } = useUserStore();
  
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    fetchOrders
  } = useOrderStore();
  const [activeTab, setActiveTab] = useState('orders');

  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchStats();
    }
  }, [user, fetchOrders, fetchStats]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const handleTrackOrder = (trackingNumber: string, orderId: string) => {
    router.push(`/tracking?tracking=${trackingNumber}&order=${orderId}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
    } catch (error) {
      // Error is already handled in the store
    }
  };

  const handleRefresh = async () => {
    try {
      await refresh();
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    }
  };

  return (    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header - Mobile Optimized */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6"
          >
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-lg sm:text-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {user?.name || 'User Profile'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                {user?.email}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-3">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                  Premium Member
                </Badge>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">4.0</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-96 gap-1 h-auto p-1">{/* Mobile: 2 columns, SM+: 4 columns */}            <TabsTrigger value="orders" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2">
              <Package className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2">
              <User className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2">
              <MapPin className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Address</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2">
              <Settings className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Settings</span>
            </TabsTrigger>
          </TabsList>          {/* Orders Tab - Mobile Optimized */}
          <TabsContent value="orders" className="mt-6 sm:mt-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Order History
                </h2>                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={handleRefresh} 
                    size="sm" 
                    className="flex-1 sm:flex-none"
                    disabled={ordersLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                    <span className="sm:hidden">Refresh</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                    <span className="hidden sm:inline">View All Orders</span>
                    <span className="sm:hidden">All</span>
                  </Button>
                </div>              </div>

              {/* Loading State */}
              {ordersLoading ? (
                <Card className="shadow-lg border-0">
                  <CardContent className="py-8 sm:py-12 text-center">
                    <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Loading orders...
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Please wait while we fetch your order history.
                    </p>
                  </CardContent>
                </Card>
              ) : /* Error State */
              ordersError ? (
                <Card className="shadow-lg border-0">
                  <CardContent className="py-8 sm:py-12 text-center">
                    <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Failed to load orders
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                      {ordersError}
                    </p>
                    <Button onClick={handleRefresh} size="sm" className="w-full sm:w-auto">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : /* Empty State */
              orders.length === 0 ? (
                <Card className="shadow-lg border-0">
                  <CardContent className="py-8 sm:py-12 text-center">
                    <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No orders yet
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                      Start shopping to see your order history here.
                    </p>
                    <Button onClick={() => router.push('/products')} size="sm" className="w-full sm:w-auto">
                      Start Shopping
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:gap-6">
                  {orders.map((order: Order, index: number) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="shadow-lg border-0">
                        <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                            <div>
                              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                                Order #{order.id}
                              </CardTitle>                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Placed on {format(order.date, 'MMM d, yyyy')}
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                {formatCurrency(order.total)}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            {/* Order Items - Mobile Optimized */}
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                                Items ({order.items.length})
                              </h4>
                              <div className="space-y-2">
                                {order.items.map((item: any, itemIndex: number) => (
                                  <div key={itemIndex} className="flex justify-between items-start sm:items-center text-xs sm:text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 flex-1 pr-2">
                                      {item.name} × {item.quantity}
                                    </span>
                                    <span className="font-medium text-right">
                                      {formatCurrency(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary - Mobile Optimized */}
                            <div className="space-y-1 pt-2 border-t text-xs sm:text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span>{formatCurrency(order.shipping)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                <span>{formatCurrency(order.tax)}</span>
                              </div>
                            </div>                            {/* Delivery Info */}
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                {order.status === 'delivered' ? (
                                  <>
                                    <Package className="h-4 w-4" />
                                    <span className="text-sm">
                                      {order.estimatedDelivery ? 
                                        `Delivered on ${format(order.estimatedDelivery, 'MMM d, yyyy')}` :
                                        'Delivered'
                                      }
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Truck className="h-4 w-4" />
                                    <span className="text-sm">
                                      {order.estimatedDelivery ? 
                                        `Est. delivery: ${format(order.estimatedDelivery, 'MMM d, yyyy')}` :
                                        'Delivery date pending'
                                      }
                                    </span>
                                  </>
                                )}
                              </div>
                                <div className="flex gap-2 flex-wrap">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleTrackOrder(order.trackingNumber || 'pending', order.id)}
                                  className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300"
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  {order.trackingNumber ? 'Track Order' : 'Track Pending'}
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                {order.status === 'pending' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                  >
                                    Cancel Order
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
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
