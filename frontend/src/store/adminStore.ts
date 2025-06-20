import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminProduct, AdminOrder, DashboardStats, ProductFormData, OrderUpdateData } from '@/types/admin';
import { addDays, subDays, format } from 'date-fns';

interface AdminStore {
  // Products
  products: AdminProduct[];
  productsLoading: boolean;
  
  // Orders
  orders: AdminOrder[];
  ordersLoading: boolean;
  
  // Dashboard stats
  dashboardStats: DashboardStats | null;
  statsLoading: boolean;
  
  // Actions
  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductFormData) => Promise<void>;
  updateProduct: (id: string, product: Partial<ProductFormData>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, data: OrderUpdateData) => Promise<void>;
  
  fetchDashboardStats: () => Promise<void>;
}

// Mock data
const mockProducts: AdminProduct[] = [
  {
    id: '1',
    name: 'Premium Water Bottles - 12oz',
    description: 'Pure, refreshing water in convenient 12oz bottles.',
    price: 8.99,
    originalPrice: 10.99,
    category: 'bottles',
    size: '12oz (12 pack)',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=400',
    inStock: true,
    stockQuantity: 150,
    features: ['BPA-Free', 'Purified Water', 'Recyclable'],
    createdAt: subDays(new Date(), 30),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: '2',
    name: 'Premium Water Bottles - 16oz',
    description: 'Larger 16oz bottles for extended hydration.',
    price: 12.99,
    category: 'bottles',
    size: '16oz (8 pack)',
    image: 'https://images.unsplash.com/photo-1609840114113-ba0e4cb995c8?w=600&h=400',
    inStock: true,
    stockQuantity: 120,
    features: ['BPA-Free', 'Purified Water', 'Recyclable'],
    createdAt: subDays(new Date(), 25),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: '3',
    name: '5-Gallon Water Jug',
    description: 'Standard 5-gallon water jug for homes.',
    price: 32.99,
    originalPrice: 35.99,
    category: 'gallons',
    size: '5 Gallon',
    image: 'https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?w=600&h=400',
    inStock: true,
    stockQuantity: 85,
    features: ['BPA-Free', 'Purified Water', 'Refillable'],
    createdAt: subDays(new Date(), 20),
    updatedAt: new Date(),
    isActive: true
  }
];

const mockOrders: AdminOrder[] = [
  {
    id: 'ORD001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1 (555) 123-4567',
    status: 'processing',
    total: 89.97,
    subtotal: 80.97,
    tax: 6.48,
    shipping: 2.52,
    items: [
      { id: '1', name: 'Premium Water Bottles - 12oz', quantity: 3, price: 8.99 },
      { id: '2', name: 'Premium Water Bottles - 16oz', quantity: 4, price: 12.99 }
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    },
    paymentMethod: { type: 'card', last4: '4242' },
    trackingNumber: 'TRK123456789',
    createdAt: subDays(new Date(), 2),
    updatedAt: new Date(),
    estimatedDelivery: addDays(new Date(), 1)
  },
  {
    id: 'ORD002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '+1 (555) 987-6543',
    status: 'shipped',
    total: 65.98,
    subtotal: 59.98,
    tax: 4.80,
    shipping: 1.20,
    items: [
      { id: '3', name: '5-Gallon Water Jug', quantity: 2, price: 32.99 }
    ],
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States'
    },
    paymentMethod: { type: 'paypal' },
    trackingNumber: 'TRK987654321',
    createdAt: subDays(new Date(), 1),
    updatedAt: new Date()
  }
];

const generateMockStats = (): DashboardStats => {
  const salesData = Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
    sales: Math.floor(Math.random() * 50) + 10,
    revenue: Math.floor(Math.random() * 2000) + 500
  }));

  return {
    totalOrders: 1247,
    totalRevenue: 156789.50,
    totalCustomers: 892,
    totalProducts: mockProducts.length,
    ordersToday: 23,
    revenueToday: 1847.30,
    ordersTrend: 12.5,
    revenueTrend: 8.7,
    topProducts: [
      { id: '1', name: 'Premium Water Bottles - 12oz', sales: 245, revenue: 2203.55 },
      { id: '3', name: '5-Gallon Water Jug', sales: 189, revenue: 6234.11 },
      { id: '2', name: 'Premium Water Bottles - 16oz', sales: 156, revenue: 2025.44 }
    ],
    recentOrders: mockOrders.slice(0, 5),
    salesData,
    orderStatusDistribution: [
      { status: 'delivered', count: 856, percentage: 68.6 },
      { status: 'shipped', count: 189, percentage: 15.2 },
      { status: 'processing', count: 134, percentage: 10.7 },
      { status: 'pending', count: 68, percentage: 5.5 }
    ]
  };
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      productsLoading: false,
      orders: [],
      ordersLoading: false,
      dashboardStats: null,
      statsLoading: false,

      // Product actions
      fetchProducts: async () => {
        set({ productsLoading: true });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ products: mockProducts, productsLoading: false });
      },

      addProduct: async (productData: ProductFormData) => {
        set({ productsLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newProduct: AdminProduct = {
          id: Date.now().toString(),
          ...productData,
          createdAt: new Date(),
          updatedAt: new Date(),
          inStock: productData.stockQuantity > 0
        };
        
        set(state => ({
          products: [...state.products, newProduct],
          productsLoading: false
        }));
      },

      updateProduct: async (id: string, productData: Partial<ProductFormData>) => {
        set({ productsLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set(state => ({
          products: state.products.map(product =>
            product.id === id
              ? {
                  ...product,
                  ...productData,
                  updatedAt: new Date(),
                  inStock: productData.stockQuantity ? productData.stockQuantity > 0 : product.inStock
                }
              : product
          ),
          productsLoading: false
        }));
      },

      deleteProduct: async (id: string) => {
        set({ productsLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => ({
          products: state.products.filter(product => product.id !== id),
          productsLoading: false
        }));
      },

      // Order actions
      fetchOrders: async () => {
        set({ ordersLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ orders: mockOrders, ordersLoading: false });
      },

      updateOrderStatus: async (id: string, updateData: OrderUpdateData) => {
        set({ ordersLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set(state => ({
          orders: state.orders.map(order =>
            order.id === id
              ? {
                  ...order,
                  ...updateData,
                  updatedAt: new Date()
                }
              : order
          ),
          ordersLoading: false
        }));
      },

      // Dashboard stats
      fetchDashboardStats: async () => {
        set({ statsLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({ dashboardStats: generateMockStats(), statsLoading: false });
      }
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        products: state.products,
        orders: state.orders
      })
    }
  )
);
