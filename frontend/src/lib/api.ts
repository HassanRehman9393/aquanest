import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('aquanest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aquanest_token');
        localStorage.removeItem('aquanest_user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  // Get all products with filters
  getProducts: async (filters?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product
  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (filters: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/products/search?${params.toString()}`);
    return response.data;
  },

  // Get product analytics (admin only)
  getProductAnalytics: async () => {
    const response = await api.get('/products/analytics');
    return response.data;
  },

  // Admin product operations
  createProduct: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  // Create new order
  createOrder: async (orderData: {
    orderItems: Array<{
      product: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: any;
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  // Get user orders
  getMyOrders: async (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get(`/orders/myorders?${params.toString()}`);
    return response.data;
  },

  // Get user orders alias for consistency
  getUserOrders: async () => {
    const response = await api.get('/orders/myorders');
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: string) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
  // Get order stats for user
  getUserOrderStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  // Track order by tracking number
  trackOrder: async (trackingNumber: string) => {
    const response = await api.get(`/orders/track/${trackingNumber}`);
    return response.data;
  },

  // Get single order
  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  // Update order (admin only)
  updateOrder: async (id: string, updateData: any) => {
    const response = await api.put(`/orders/${id}`, updateData);
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Update order to paid
  markOrderAsPaid: async (id: string, paymentResult: any) => {
    const response = await api.put(`/orders/${id}/pay`, paymentResult);
    return response.data;
  },

  // Get all orders (admin only)
  getAllOrders: async (filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/orders?${params.toString()}`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Analytics
  getAnalytics: async (period?: string) => {
    const params = period ? `?period=${period}` : '';
    const response = await api.get(`/admin/analytics${params}`);
    return response.data;
  },
  // User management
  getUsers: async (filters?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.role) params.append('role', filters.role);
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  // Get customers specifically  
  getCustomers: async (filters?: {
    page?: number;
    limit?: number;
    search?: string;
    segment?: string;
    status?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.segment) params.append('segment', filters.segment);
    if (filters?.status) params.append('status', filters.status);
    params.append('role', 'customer'); // Only get customers
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Bulk operations
  bulkUpdateStock: async (updates: Array<{ productId: string; stock: number }>) => {
    const response = await api.put('/admin/products/bulk-stock', { updates });
    return response.data;
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
