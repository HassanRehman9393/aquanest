'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, TrendingUp, Droplets, User, Calendar, MapPin } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

function DashboardContent() {
  const { user } = useAuth();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Orders',
      value: '24',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Active Subscriptions',
      value: '2',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Delivered',
      value: '22',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      title: 'This Month',
      value: '8',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  const recentOrders = [
    { id: 'ORD-001', product: '5L Premium Water - 4 Bottles', status: 'delivered', date: '2025-06-18', amount: '$24.99' },
    { id: 'ORD-002', product: '1L Alkaline Water - 12 Bottles', status: 'in-transit', date: '2025-06-19', amount: '$18.99' },
    { id: 'ORD-003', product: '5L Spring Water - 2 Bottles', status: 'processing', date: '2025-06-20', amount: '$12.99' },
  ];

  const subscriptions = [
    { id: 'SUB-001', plan: 'Weekly Premium', nextDelivery: '2025-06-25', status: 'active' },
    { id: 'SUB-002', plan: 'Monthly Alkaline', nextDelivery: '2025-07-05', status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Here's an overview of your AquaNest account
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <motion.div variants={fadeInUp}>
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Package className="h-5 w-5 text-blue-600" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Your latest water delivery orders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</span>
                          <Badge 
                            variant={order.status === 'delivered' ? 'default' : order.status === 'in-transit' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{order.product}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.amount}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Subscriptions */}
            <motion.div variants={fadeInUp}>
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    Active Subscriptions
                  </CardTitle>
                  <CardDescription>Your recurring water delivery plans</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{sub.plan}</span>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          {sub.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4" />
                        <span>Next delivery: {sub.nextDelivery}</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Manage Subscriptions
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp}>
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
                <CardDescription>Manage your account and orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                    <Package className="h-4 w-4 mr-2" />
                    New Order
                  </Button>
                  <Button variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Delivery Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
