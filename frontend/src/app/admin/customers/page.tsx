'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  TrendingUp,
  MoreHorizontal,
  Eye,
  MessageCircle,
  Ban,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { adminAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  joinDate: Date;
  status: 'active' | 'inactive' | 'suspended';
  segment: 'new' | 'regular' | 'vip' | 'at-risk';
  isActive: boolean;
  role: string;
  orders?: Array<{
    id: string;
    date: Date;
    total: number;
    status: string;
    items: number;
  }>;
}

const segmentConfig = {
  vip: { 
    label: 'VIP', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: TrendingUp
  },
  regular: { 
    label: 'Regular', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Users
  },
  new: { 
    label: 'New', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: UserPlus
  },
  'at-risk': {
    label: 'At Risk',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: TrendingUp
  }
};

const statusConfig = {
  active: { 
    label: 'Active', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  inactive: { 
    label: 'Inactive', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Users
  },
  suspended: { 
    label: 'Suspended', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: Ban
  }
};

interface CustomerCardProps {
  customer: Customer;
  onStatusUpdate: (customerId: string, status: Customer['status']) => void;
}

function CustomerCard({ customer, onStatusUpdate }: CustomerCardProps) {
  const SegmentIcon = segmentConfig[customer.segment].icon;
  const StatusIcon = statusConfig[customer.status].icon;
  
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" alt={customer.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn("border text-xs", segmentConfig[customer.segment].color)}>
              <SegmentIcon className="h-3 w-3 mr-1" />
              {segmentConfig[customer.segment].label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>                <DropdownMenuItem>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusUpdate(customer.id, customer.status === 'active' ? 'suspended' : 'active')}
                  className={customer.status === 'suspended' ? 'text-green-600' : 'text-red-600'}
                >
                  {customer.status === 'suspended' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate Customer
                    </>
                  ) : (
                    <>
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend Customer
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Orders</p>
            <p className="font-semibold">{customer.totalOrders}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Spent</p>
            <p className="font-semibold">${customer.totalSpent.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Order</p>
            <p className="font-semibold">${customer.averageOrderValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Last Order</p>
            <p className="font-semibold">{customer.lastOrderDate ? format(customer.lastOrderDate, 'MMM dd') : 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{customer.address ? `${customer.address.city}, ${customer.address.state}` : 'No address'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={cn("border text-xs", statusConfig[customer.status].color)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[customer.status].label}
            </Badge>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Customer Details - {customer.name}</DialogTitle>
                </DialogHeader>
                <CustomerDetails customer={customer} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerDetails({ customer }: { customer: Customer }) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Joined {format(customer.joinDate, 'MMM dd, yyyy')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Purchase Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Orders:</span>
                  <span className="font-semibold">{customer.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Spent:</span>
                  <span className="font-semibold">${customer.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Order:</span>
                  <span className="font-semibold">${customer.averageOrderValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Order:</span>
                  <span className="font-semibold">{customer.lastOrderDate ? format(customer.lastOrderDate, 'MMM dd, yyyy') : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="space-y-3">            {customer.orders && customer.orders.length > 0 ? customer.orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{order.id}</h4>
                      <p className="text-sm text-gray-500">
                        {format(order.date, 'MMM dd, yyyy')} • {order.items} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No orders found
                </CardContent>
              </Card>            )}
          </div>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>            <CardContent>
              {customer.address ? (
                <div className="space-y-1">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.address.street}</p>
                  <p className="text-sm text-gray-600">
                    {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{customer.address.country}</p>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No address on file
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getCustomers({ limit: 100 });
      
      // Transform backend user data to match our Customer interface
      const transformedCustomers = response.data.map((user: any) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        totalOrders: user.orderStats?.totalOrders || 0,
        totalSpent: user.orderStats?.totalSpent || 0,
        averageOrderValue: user.orderStats?.averageOrderValue || 0,
        lastOrderDate: user.orderStats?.lastOrderDate ? new Date(user.orderStats.lastOrderDate) : undefined,
        joinDate: new Date(user.createdAt),
        status: user.isActive ? 'active' : 'inactive',
        segment: determineSegment(user.orderStats),
        isActive: user.isActive,
        role: user.role,
        orders: [] // Would need separate API call to get user orders
      }));
      
      setCustomers(transformedCustomers);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      setError(error.response?.data?.message || 'Failed to fetch customers');
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  // Determine customer segment based on order stats
  const determineSegment = (orderStats: any) => {
    if (!orderStats) return 'new';
    
    const totalOrders = orderStats.totalOrders || 0;
    const totalSpent = orderStats.totalSpent || 0;
    
    if (totalOrders >= 10 && totalSpent >= 500) return 'vip';
    if (totalOrders >= 3) return 'regular';
    if (totalOrders === 0) return 'new';
    return 'regular';
  };

  // Update customer status
  const handleUpdateStatus = async (customerId: string, isActive: boolean) => {
    try {
      await adminAPI.updateUserStatus(customerId, isActive);
      setCustomers(prev => prev.map(customer =>
        customer.id === customerId
          ? { ...customer, isActive, status: isActive ? 'active' : 'inactive' }
          : customer
      ));
      toast.success(`Customer ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      toast.error(`Failed to update customer status: ${error.response?.data?.message || error.message}`);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchTerm))
      );
    }

    if (segmentFilter && segmentFilter !== 'all') {
      filtered = filtered.filter(customer => customer.segment === segmentFilter);
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, segmentFilter, statusFilter]);

  const handleStatusUpdate = (customerId: string, newStatus: Customer['status']) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, status: newStatus }
          : customer
      )
    );
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.segment === 'vip').length,
    new: customers.filter(c => c.segment === 'new').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Customers"
        description="Manage your customer relationships"
        icon={Users}
      >
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </AdminPageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.vip}</p>
                <p className="text-sm text-gray-600">VIP</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.new}</p>
                <p className="text-sm text-gray-600">New</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={segmentFilter || 'all'} onValueChange={(value) => setSegmentFilter(value === 'all' ? null : value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                {Object.entries(segmentConfig).map(([segment, config]) => (
                  <SelectItem key={segment} value={segment}>
                    <div className="flex items-center gap-2">
                      <config.icon className="h-3 w-3" />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center gap-2">
                      <config.icon className="h-3 w-3" />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid gap-4">
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">
                {searchTerm || segmentFilter || statusFilter 
                  ? "Try adjusting your search or filter criteria"
                  : "Customers will appear here once they start placing orders"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div 
            className="grid gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CustomerCard 
                  customer={customer} 
                  onStatusUpdate={handleStatusUpdate}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
