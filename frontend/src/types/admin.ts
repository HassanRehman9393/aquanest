export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  lastLogin?: Date;
  isActive: boolean;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'bottles' | 'gallons' | 'dispensers';
  size: string;
  image: string;
  inStock: boolean;
  stockQuantity: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: 'card' | 'paypal' | 'cash_on_delivery';
    last4?: string;
  };
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  ordersToday: number;
  revenueToday: number;
  ordersTrend: number; // percentage change
  revenueTrend: number; // percentage change
  topProducts: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  recentOrders: AdminOrder[];
  salesData: {
    date: string;
    sales: number;
    revenue: number;
  }[];
  orderStatusDistribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'bottles' | 'gallons' | 'dispensers';
  size: string;
  image: string;
  stockQuantity: number;
  features: string[];
  isActive: boolean;
}

export interface OrderUpdateData {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
}
