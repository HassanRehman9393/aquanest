'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  MoreVertical,
  BarChart3,
  Settings,
  ArrowRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAdminStore } from '@/store/adminStore';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Order Status Chart Component
function OrderStatusChart({ data }: { data: { status: string; count: number; percentage: number }[] }) {
  const chartData = {
    labels: data.map(item => item.status.charAt(0).toUpperCase() + item.status.slice(1)),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: [
          '#F59E0B', // pending - yellow
          '#3B82F6', // processing - blue
          '#8B5CF6', // shipped - purple
          '#10B981', // delivered - green
          '#EF4444', // cancelled - red
        ],
        borderColor: 'white',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} orders (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    elements: {
      arc: {
        borderRadius: 4,
      }
    }
  };

  return (
    <div className="w-full h-64 relative">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
function RevenueChart({ data }: { data: { date: string; sales: number; revenue: number }[] }) {
  const chartData = {
    labels: data.map(d => format(new Date(d.date), 'MMM dd')),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(d => d.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'white',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            return `Revenue: $${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    onHover: (event: any, activeElements: any) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    },
  };

  return (
    <div className="w-full h-48 relative">
      <Line data={chartData} options={options} />
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  trend
}: {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
  trend?: number[];
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
            <div className="flex items-center mt-2">
              {changeType === 'increase' ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                from last month
              </span>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        {trend && (
          <div className="mt-4">
            <div className="w-full h-8">
              <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points={trend.map((value, index) => 
                    `${(index / (trend.length - 1)) * 100},${20 - (value / Math.max(...trend)) * 15}`
                  ).join(' ')}
                />
              </svg>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { dashboardStats, statsLoading, fetchDashboardStats } = useAdminStore();
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (statsLoading || !dashboardStats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your business.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={fadeInUp}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(dashboardStats.totalRevenue)}
            change={`+${dashboardStats.revenueTrend}%`}
            changeType="increase"
            icon={DollarSign}
            trend={[45, 52, 48, 61, 58, 67, 73]}
          />
        </motion.div>
        
        <motion.div variants={fadeInUp}>
          <StatCard
            title="Total Orders"
            value={dashboardStats.totalOrders.toLocaleString()}
            change={`+${dashboardStats.ordersTrend}%`}
            changeType="increase"
            icon={ShoppingCart}
            trend={[35, 41, 38, 51, 49, 62, 69]}
          />
        </motion.div>
        
        <motion.div variants={fadeInUp}>
          <StatCard
            title="Total Customers"
            value={dashboardStats.totalCustomers.toLocaleString()}
            change="+8.2%"
            changeType="increase"
            icon={Users}
            trend={[25, 31, 28, 41, 39, 52, 59]}
          />
        </motion.div>
        
        <motion.div variants={fadeInUp}>
          <StatCard
            title="Products"
            value={dashboardStats.totalProducts.toString()}
            change="+2.1%"
            changeType="increase"
            icon={Package}
            trend={[15, 21, 18, 31, 29, 42, 49]}
          />
        </motion.div>      </motion.div>

      {/* Quick Navigation */}
      <motion.div
        variants={fadeInUp}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4 hover:bg-white/50 dark:hover:bg-slate-800/50"
                onClick={() => router.push('/admin/products')}
              >
                <Package className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Products</div>
                  <div className="text-xs text-gray-600">Manage inventory</div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4 hover:bg-white/50 dark:hover:bg-slate-800/50"
                onClick={() => router.push('/admin/orders')}
              >
                <ShoppingCart className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Orders</div>
                  <div className="text-xs text-gray-600">Track & update</div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4 hover:bg-white/50 dark:hover:bg-slate-800/50"
                onClick={() => router.push('/admin/customers')}
              >
                <Users className="h-6 w-6 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium">Customers</div>
                  <div className="text-xs text-gray-600">View & manage</div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4 hover:bg-white/50 dark:hover:bg-slate-800/50"
                onClick={() => router.push('/admin/analytics')}
              >
                <BarChart3 className="h-6 w-6 text-orange-600" />
                <div className="text-center">
                  <div className="font-medium">Analytics</div>
                  <div className="text-xs text-gray-600">Detailed reports</div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Revenue Overview</span>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart data={dashboardStats.salesData} />
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Last 30 days</span>
                <span>Total: {formatCurrency(dashboardStats.salesData.reduce((sum, d) => sum + d.revenue, 0))}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardStats.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Orders</span>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardStats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.customerName} • {format(order.createdAt, 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'shipped' ? 'secondary' :
                        order.status === 'processing' ? 'outline' : 'destructive'
                      }
                      className="mb-1"
                    >
                      {order.status}
                    </Badge>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>        {/* Order Status Distribution */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>            </CardHeader>
            <CardContent>
              <OrderStatusChart data={dashboardStats.orderStatusDistribution} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
