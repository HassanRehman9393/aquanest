'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, MapPin, Clock, CheckCircle, Phone, Mail, Copy, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format, addDays, subDays } from 'date-fns';
import { toast } from 'sonner';
import { useOrderStore } from '@/store/orderStore';
import { ordersAPI } from '@/lib/api';

// Mock map component - Mobile Optimized
const MockDeliveryMap = () => {
  const [currentPosition, setCurrentPosition] = useState({ x: 25, y: 60 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 2,
        y: prev.y + (Math.random() - 0.5) * 2
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-60 sm:h-80 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
        {/* Mock roads */}
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M0,100 Q200,80 400,120 T800,100"
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
            className="dark:stroke-gray-600"
          />
          <path
            d="M100,0 Q120,150 140,300"
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
            className="dark:stroke-gray-600"
          />
        </svg>

        {/* Delivery route */}
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M50,200 Q150,180 250,190 Q350,200 450,180 Q550,160 650,170"
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
          />
        </svg>

        {/* Starting point (warehouse) */}
        <div className="absolute" style={{ left: '5%', top: '60%' }}>
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute -top-8 -left-6 text-xs font-medium text-green-700 dark:text-green-400 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
            Warehouse
          </div>
        </div>

        {/* Destination */}
        <div className="absolute" style={{ left: '85%', top: '50%' }}>
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute -top-8 -left-8 text-xs font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow">
            Your Address
          </div>
        </div>

        {/* Moving truck */}
        <motion.div
          className="absolute"
          style={{ left: `${currentPosition.x}%`, top: `${currentPosition.y}%` }}
          animate={{ left: `${currentPosition.x}%`, top: `${currentPosition.y}%` }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <div className="relative">
            <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div className="absolute -top-8 -left-8 text-xs font-medium text-blue-700 dark:text-blue-400 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow whitespace-nowrap">
              Delivery Truck
            </div>
          </div>
        </motion.div>

        {/* Mock locations */}
        <div className="absolute left-1/4 top-1/3">
          <MapPin className="w-3 h-3 text-gray-400" />
        </div>
        <div className="absolute left-1/2 top-1/4">
          <MapPin className="w-3 h-3 text-gray-400" />
        </div>
        <div className="absolute left-3/4 top-2/3">
          <MapPin className="w-3 h-3 text-gray-400" />
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button size="sm" variant="outline" className="w-8 h-8 p-0">
          +
        </Button>
        <Button size="sm" variant="outline" className="w-8 h-8 p-0">
          -
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Warehouse</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-3 h-3 text-blue-600" />
            <span>Delivery Vehicle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Destination</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackingNumber = searchParams.get('tracking');
  const orderId = searchParams.get('order');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getOrderById } = useOrderStore();

  // Fetch tracking data
  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        setError(null);
          if (orderId) {
          // Try to get order from user store first
          const order = getOrderById(orderId);
          if (order) {
            // Create dynamic timeline based on order status
            const createTimeline = (orderStatus: string, createdAt: Date, updatedAt: Date) => {
              const baseTimeline = [
                {
                  status: 'order_placed',
                  title: 'Order Placed',
                  description: 'Your order has been received and is being prepared',
                  timestamp: createdAt,
                  completed: true
                },
                {
                  status: 'processing',
                  title: 'Processing',
                  description: 'Your order is being prepared for shipment',
                  timestamp: createdAt,
                  completed: ['processing', 'shipped', 'delivered'].includes(orderStatus),
                  current: orderStatus === 'processing'
                },
                {
                  status: 'shipped',
                  title: 'Shipped',
                  description: 'Your order is on its way to you',
                  timestamp: ['shipped', 'delivered'].includes(orderStatus) ? updatedAt : undefined,
                  completed: ['shipped', 'delivered'].includes(orderStatus),
                  current: orderStatus === 'shipped'
                },
                {
                  status: 'delivered',
                  title: 'Delivered',
                  description: 'Your order has been delivered',
                  timestamp: orderStatus === 'delivered' ? updatedAt : undefined,
                  completed: orderStatus === 'delivered'
                }
              ];

              // Handle cancelled orders
              if (orderStatus === 'cancelled') {
                return [
                  baseTimeline[0], // Order placed
                  {
                    status: 'cancelled',
                    title: 'Order Cancelled',
                    description: 'Your order has been cancelled',
                    timestamp: updatedAt,
                    completed: true,
                    current: true
                  }
                ];
              }

              return baseTimeline;
            };

            const dynamicTimeline = createTimeline(order.status, order.date, order.date);

            setTrackingData({
              orderId: order.id,
              orderNumber: order.id,
              trackingNumber: order.trackingNumber || trackingNumber,
              status: order.status,
              estimatedDelivery: order.estimatedDelivery,
              currentLocation: 'AquaNest Distribution Center',
              lastUpdate: order.date,
              carrier: 'AquaNest Express',
              deliveryAddress: order.shippingAddress ? 
                `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}` :
                'Address not available',
              customerPhone: 'Contact support for assistance',
              driverName: 'Driver assigned',
              driverPhone: 'Available on delivery day',
              vehicleNumber: 'ANE-2024',
              progress: getProgressFromStatus(order.status),
              timeline: dynamicTimeline,
              items: order.items
            });
            setLoading(false);
            return;
          }
        }

        // If no order found locally and we have a tracking number, try API
        if (trackingNumber) {
          try {
            const response = await ordersAPI.trackOrder(trackingNumber);
            setTrackingData(response.data);
          } catch (apiError) {
            // Fall back to a generic tracking response
            setTrackingData({
              orderId: orderId || 'Unknown',
              orderNumber: orderId || 'Unknown',
              trackingNumber: trackingNumber,
              status: 'in_transit',
              estimatedDelivery: addDays(new Date(), 2),
              currentLocation: 'In Transit',
              lastUpdate: new Date(),
              carrier: 'AquaNest Express',
              deliveryAddress: 'Address on file',
              progress: 50,
              timeline: [],
              items: []
            });
          }
        } else {
          setError('No tracking information provided');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tracking information');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [orderId, trackingNumber, getOrderById]);

  const getProgressFromStatus = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'processing': return 25;
      case 'shipped': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };
  const copyTrackingNumber = () => {
    const numberToCopy = trackingData.trackingNumber;
    if (numberToCopy) {
      navigator.clipboard.writeText(numberToCopy);
      toast.success('Tracking number copied to clipboard!');
    }
  };

  const refreshTracking = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('Tracking information updated!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_transit':
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'order_placed': return 'Order Placed';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'in_transit': return 'In Transit';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  // Safe date formatting function
  const formatSafeDate = (date: any, formatString: string) => {
    try {
      const validDate = date instanceof Date ? date : new Date(date);
      if (isNaN(validDate.getTime())) {
        return 'Invalid Date';
      }
      return format(validDate, formatString);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header - Mobile Optimized */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Track Your Delivery
                </h1>                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Order #{trackingData?.orderId || orderId || 'Unknown'}
                </p>
              </div>
            </div>
            
            <Button
              onClick={refreshTracking}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Loading State */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Loading tracking information...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we fetch your order details.
              </p>
            </CardContent>
          </Card>
        ) : /* Error State */
        error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Unable to track order
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push('/profile')} variant="outline">
                  View Orders
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : /* Main Content */
        trackingData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Tracking Info - Mobile First */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Delivery Status
                  </CardTitle>                  <Badge className={getStatusColor(trackingData.status)}>
                    {getStatusText(trackingData.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tracking Number</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{trackingData.trackingNumber}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyTrackingNumber}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Delivery</p>                    <p className="font-medium">
                      {formatSafeDate(trackingData.estimatedDelivery, 'EEEE, MMMM d')}
                    </p>
                  </div>
                </div>                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Delivery Progress</span>
                    <span>{trackingData.progress}%</span>
                  </div>
                  <Progress value={trackingData.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Location</p>
                    <p className="font-medium">{trackingData.currentLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>                    <p className="font-medium">
                      {formatSafeDate(trackingData.lastUpdate, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Live Tracking Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MockDeliveryMap />
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                    <Truck className="h-4 w-4" />                    <span>
                      Your delivery is currently <strong>{trackingData.progress}%</strong> of the way to you. 
                      Estimated arrival: <strong>{formatSafeDate(trackingData.estimatedDelivery, 'h:mm a')}</strong>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>                <div className="space-y-4">
                  {trackingData.timeline.map((event: any, index: number) => (
                    <motion.div
                      key={event.status}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="relative">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center border-2
                          ${event.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                          }
                          ${event.current ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''}
                        `}>
                          {event.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="w-2 h-2 bg-current rounded-full" />
                          )}
                        </div>
                        {index < trackingData.timeline.length - 1 && (
                          <div className={`
                            absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8
                            ${event.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                          `} />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${
                            event.current ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {event.title}
                          </h4>                          <span className="text-sm text-gray-500">
                            {formatSafeDate(event.timestamp, 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Details */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Address</p>
                  <p className="font-medium">{trackingData.deliveryAddress}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Carrier</p>
                  <p className="font-medium">{trackingData.carrier}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vehicle Number</p>
                  <p className="font-medium font-mono">{trackingData.vehicleNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Driver Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Driver Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Driver Name</p>
                  <p className="font-medium">{trackingData.driverName}</p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Driver
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Message Driver
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customer Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Available 24/7 for delivery assistance
                </p>
              </CardContent>            </Card>
          </div>
        </div>
        ) : null
        }
      </div>
    </div>
  );
}
