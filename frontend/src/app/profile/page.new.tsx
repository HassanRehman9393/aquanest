'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Settings, CreditCard, MapPin, Bell, Shield, Heart, Star, Calendar, Truck, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { useUserStore } from '@/store/userStore';
import { useOrderStore } from '@/store/orderStore';

export default function ProfilePage() {
  const { user } = useAuth();
  const { stats } = useUserStore();
  const { orders, loading: ordersLoading, error: ordersError, fetchOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch orders when component mounts
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-800 border-purple-300', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800 border-green-300', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-300', label: 'Cancelled' }
    };

    const config = configs[status as keyof typeof configs] || configs.pending;
    return (
      <Badge variant="outline" className={`${config.color} border font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your profile
          </h1>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6"
          >            <motion.div variants={fadeInUp} className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
                <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.name || 'Customer'}!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  {user.email}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400">
                    <Heart className="h-3 w-3 mr-1" />
                    Premium Member
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Member since {format(new Date(user.createdAt || new Date()), 'MMMM yyyy')}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalOrders || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <CreditCard className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats?.totalSpent || 0)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                </CardContent>
              </Card>
                <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalOrders ? formatCurrency(stats.totalSpent / stats.totalOrders) : '$0'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Order</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {orders.length > 0 ? format(orders[0].date, 'MMM d') : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Order</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <p className="text-gray-900 dark:text-white">{user.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <p className="text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <p className="text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Default Address
                  </CardTitle>
                </CardHeader>                <CardContent>
                  <div className="space-y-2">
                    <p className="text-gray-900 dark:text-white">
                      {user.address || 'No default address set'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order History
                </h2>                <Button variant="outline" onClick={() => fetchOrders()} disabled={ordersLoading}>
                  {ordersLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Refresh Orders'
                  )}
                </Button>
              </div>

              {ordersError && (
                <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <CardContent className="p-4">
                    <p className="text-red-700 dark:text-red-400">
                      Failed to load orders: {ordersError}
                    </p>
                  </CardContent>
                </Card>
              )}

              {ordersLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No orders found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You haven't placed any orders yet.
                    </p>
                    <Button onClick={() => window.location.href = '/products'}>
                      Start Shopping
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {orders.map((order: any, index: number) => (
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
                              </CardTitle>                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                            {/* Order Items */}                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                Items ({order.items?.length || 0})
                              </h4>
                              <div className="space-y-2">
                                {order.items?.map((item: any, itemIndex: number) => (
                                  <div key={itemIndex} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      {item.name} × {item.quantity}
                                    </span>
                                    <span className="font-medium">
                                      {formatCurrency(item.price * item.quantity)}
                                    </span>
                                  </div>
                                )) || []}
                              </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                {order.status === 'delivered' ? (
                                  <>
                                    <Package className="h-4 w-4" />
                                    <span className="text-sm">
                                      Delivered on {order.deliveredAt ? format(new Date(order.deliveredAt), 'MMM d, yyyy') : 'N/A'}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Truck className="h-4 w-4" />
                                    <span className="text-sm">
                                      Est. delivery: {order.estimatedDelivery ? format(new Date(order.estimatedDelivery), 'MMM d, yyyy') : 'TBD'}
                                    </span>
                                  </>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                {order.trackingNumber && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.location.href = `/tracking?trackingNumber=${order.trackingNumber}`}
                                  >
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
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Order updates</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Delivery notifications</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Marketing emails</span>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700">Disabled</Badge>
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
                    Download Data
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
