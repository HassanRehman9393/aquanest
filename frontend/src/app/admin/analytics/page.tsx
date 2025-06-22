'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Calendar,
  Download,
  Filter,
  BarChart3
} from 'lucide-react';

// Dynamic imports for chart components to reduce initial bundle size
const DynamicLine = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Line })), {
  ssr: false,
  loading: () => <ChartSkeleton />
});
const DynamicBar = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Bar })), {
  ssr: false,
  loading: () => <ChartSkeleton />
});
const DynamicDoughnut = dynamic(() => import('react-chartjs-2').then(mod => ({ default: mod.Doughnut })), {
  ssr: false,
  loading: () => <ChartSkeleton />
});

// Chart.js registration - only load when needed
const initializeCharts = async () => {
  const ChartJSModule = await import('chart.js');
  const {
    Chart: ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } = ChartJSModule;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );
};

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { useAdminStore } from '@/store/adminStore';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';

// Chart skeleton component for loading states
function ChartSkeleton() {
  return (
    <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-500">Loading chart...</p>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
}

function MetricCard({ title, value, change, icon: Icon, isLoading }: MetricCardProps) {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            )}
          </div>
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        {!isLoading && (
          <div className="flex items-center mt-4">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={cn(
              "text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { dashboardStats, statsLoading, fetchDashboardStats } = useAdminStore();
  const [timeRange, setTimeRange] = useState('30days');
  const [chartType, setChartType] = useState('line');
  const [chartsInitialized, setChartsInitialized] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    // Initialize charts when component mounts
    initializeCharts().then(() => setChartsInitialized(true));
  }, [fetchDashboardStats]);

  // Chart configurations
  const revenueChartData = {
    labels: dashboardStats?.salesData.map(d => format(new Date(d.date), 'MMM dd')) || [],
    datasets: [
      {
        label: 'Revenue',
        data: dashboardStats?.salesData.map(d => d.revenue) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const salesChartData = {
    labels: dashboardStats?.salesData.map(d => format(new Date(d.date), 'MMM dd')) || [],
    datasets: [
      {
        label: 'Orders',
        data: dashboardStats?.salesData.map(d => d.sales) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      }
    ]
  };

  const orderStatusData = {
    labels: dashboardStats?.orderStatusDistribution.map(d => d.status.charAt(0).toUpperCase() + d.status.slice(1)) || [],
    datasets: [
      {
        data: dashboardStats?.orderStatusDistribution.map(d => d.count) || [],
        backgroundColor: [
          '#F59E0B', // pending - yellow
          '#3B82F6', // processing - blue
          '#8B5CF6', // shipped - purple
          '#10B981', // delivered - green
          '#EF4444', // cancelled - red
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const exportAnalytics = () => {
    if (!dashboardStats) return;
    
    const data = {
      summary: {
        totalOrders: dashboardStats.totalOrders,
        totalRevenue: dashboardStats.totalRevenue,
        totalCustomers: dashboardStats.totalCustomers,
        totalProducts: dashboardStats.totalProducts,
      },
      salesData: dashboardStats.salesData,
      orderStatusDistribution: dashboardStats.orderStatusDistribution,
      topProducts: dashboardStats.topProducts,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Analytics"
        description="Track your business performance and insights"
        icon={BarChart3}
      >
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportAnalytics} disabled={statsLoading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </AdminPageHeader>

      {/* Key Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Revenue"
          value={`$${dashboardStats?.totalRevenue.toLocaleString() || '0'}`}
          change={dashboardStats?.revenueTrend || 0}
          icon={DollarSign}
          isLoading={statsLoading}
        />
        <MetricCard
          title="Total Orders"
          value={dashboardStats?.totalOrders.toLocaleString() || '0'}
          change={dashboardStats?.ordersTrend || 0}
          icon={ShoppingCart}
          isLoading={statsLoading}
        />
        <MetricCard
          title="Total Customers"
          value={dashboardStats?.totalCustomers.toLocaleString() || '0'}
          change={8.2}
          icon={Users}
          isLoading={statsLoading}
        />
        <MetricCard          title="Total Products"
          value={dashboardStats?.totalProducts.toLocaleString() || '0'}
          change={2.1}
          icon={Package}
          isLoading={statsLoading}
        />
      </motion.div>      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="orders">Order Trends</TabsTrigger>
          <TabsTrigger value="status">Order Status</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Revenue Over Time</CardTitle>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>              <div className="h-96">
                {statsLoading || !chartsInitialized ? (
                  <ChartSkeleton />
                ) : chartType === 'line' ? (
                  <DynamicLine data={revenueChartData} options={chartOptions} />
                ) : (
                  <DynamicBar data={{...revenueChartData, datasets: [{...revenueChartData.datasets[0], backgroundColor: 'rgba(59, 130, 246, 0.8)'}]}} options={chartOptions} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
            </CardHeader>
            <CardContent>              <div className="h-96">
                {statsLoading || !chartsInitialized ? (
                  <ChartSkeleton />
                ) : (
                  <DynamicBar data={salesChartData} options={chartOptions} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>                <div className="h-80">
                  {statsLoading || !chartsInitialized ? (
                    <ChartSkeleton />
                  ) : (
                    <DynamicDoughnut data={orderStatusData} options={doughnutOptions} />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardStats?.orderStatusDistribution.map((item, index) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ 
                            backgroundColor: ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'][index] 
                          }}
                        />
                        <span className="capitalize font-medium">{item.status}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{item.count}</p>
                        <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  dashboardStats?.topProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.sales} sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">revenue</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>        </TabsContent>
      </Tabs>
      </motion.div>
    </div>
  );
}
