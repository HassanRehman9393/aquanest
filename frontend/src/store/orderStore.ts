import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order, CartItem, ShippingAddress, PaymentMethod } from '@/types/cart';
import { addDays } from 'date-fns';
import { ordersAPI } from '@/lib/api';
import { toast } from 'sonner';

interface OrderStore {
  // State
  orders: Order[];
  loading: boolean;
  error: string | null;
  
  // Actions
  createOrder: (items: CartItem[], shippingAddress: ShippingAddress, paymentMethod: PaymentMethod, totals: { total: number; subtotal: number; tax: number; shipping: number }) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: Order['status']) => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  fetchOrders: () => Promise<void>;
  clearOrders: () => void;
  
  // Helpers
  isValidObjectId: (id: string) => boolean;
}

const generateOrderId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `AQ${timestamp}${random}`;
};

const generateTrackingNumber = (): string => {
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `TRK${random}`;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => {
      // Add event listener for auto-fetching orders after login
      if (typeof window !== 'undefined') {
        const handleUserLogin = () => {
          // Clear any existing local orders and fetch from database
          console.log('User logged in, fetching orders from database...');
          setTimeout(() => {
            get().fetchOrders();
          }, 100);
        };
        
        const handleUserLogout = () => {
          // Clear all orders when user logs out
          console.log('User logged out, clearing orders...');
          set({ orders: [], loading: false, error: null });
        };
        
        window.addEventListener('user-logged-in', handleUserLogin);
        window.addEventListener('user-logged-out', handleUserLogout);
      }
      
      return {
        // Initial state
        orders: [],
        loading: false,
        error: null,        // Helper function to validate MongoDB ObjectId
        isValidObjectId: (id: string): boolean => {
          return /^[0-9a-fA-F]{24}$/.test(id);
        },        // Create a new order via API
        createOrder: async (items, shippingAddress, paymentMethod, totals) => {
          set({ loading: true, error: null });
          
          try {
            // Check if user is authenticated
            const token = typeof window !== 'undefined' ? localStorage.getItem('aquanest_token') : null;
            const isAuthenticated = !!token;

            console.log('Order creation - Authentication status:', isAuthenticated);
            console.log('Order creation - Items:', items.map(item => ({ name: item.product.name, id: item.product.id })));            // Only proceed with API call if user is authenticated
            if (isAuthenticated) {
              // Check for invalid product IDs (demo/mock products)
              const invalidProducts = items.filter(item => !get().isValidObjectId(item.product.id));
              
              console.log('=== FRONTEND ORDER CREATION ===');
              console.log('Total items:', items.length);
              console.log('Invalid products detected:', invalidProducts.length);
              console.log('All product IDs:', items.map(item => ({ name: item.product.name, id: item.product.id })));
              
              if (invalidProducts.length > 0) {
                console.warn('Demo products detected in cart:', invalidProducts.map(item => ({ name: item.product.name, id: item.product.id })));
                toast.info('Demo products detected. Order will be saved locally for demonstration.');
                
                // Create local order for demo products
                const orderId = generateOrderId();
                const trackingNumber = generateTrackingNumber();
                const orderDate = new Date();
                const estimatedDelivery = addDays(orderDate, 3);

                const demoOrder: Order = {
                  id: orderId,
                  date: orderDate,
                  status: 'processing',
                  items: items.map(item => ({
                    id: item.id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.image,
                    selectedOptions: item.selectedOptions
                  })),
                  total: totals.total,
                  subtotal: totals.subtotal,
                  tax: totals.tax,
                  shipping: totals.shipping,
                  shippingAddress,
                  paymentMethod,
                  estimatedDelivery,
                  trackingNumber,
                  orderNotes: undefined
                };

                set(state => ({
                  orders: [demoOrder, ...state.orders],
                  loading: false
                }));

                console.log('Demo order created locally:', demoOrder);
                return demoOrder;
              }

              // All products have valid IDs, proceed with API call
              try {
                console.log('Creating order via API for authenticated user with valid products');
                
                // Transform cart items to backend format
                const orderItems = items.map(item => ({
                  product: item.product.id,
                  quantity: item.quantity,
                  price: item.product.price,
                  name: item.product.name
                }));                // Transform shipping address to backend format
                const backendShippingAddress = {
                  street: shippingAddress.address,
                  city: shippingAddress.city,
                  state: shippingAddress.state,
                  zipCode: shippingAddress.zipCode,
                  country: shippingAddress.country || 'USA'
                };

                // Map frontend payment method to backend enum values
                const mapPaymentMethod = (frontendMethod: string): string => {
                  switch (frontendMethod.toLowerCase()) {
                    case 'card':
                    case 'credit_card':
                      return 'credit_card';
                    case 'debit':
                    case 'debit_card':
                      return 'debit_card';
                    case 'paypal':
                      return 'paypal';
                    case 'cash':
                    case 'cod':
                    case 'cash_on_delivery':
                      return 'cash_on_delivery';
                    default:
                      return 'credit_card'; // Default fallback
                  }
                };

                const backendPaymentMethod = mapPaymentMethod(paymentMethod.type);
                console.log('Payment method mapping:', paymentMethod.type, '→', backendPaymentMethod);

                // Create order via API
                const response = await ordersAPI.createOrder({
                  orderItems,
                  shippingAddress: backendShippingAddress,
                  paymentMethod: backendPaymentMethod,
                  itemsPrice: totals.subtotal,
                  taxPrice: totals.tax,
                  shippingPrice: totals.shipping,
                  totalPrice: totals.total
                });

                console.log('Backend order creation response:', response);

                // Transform API response to local Order format
                const newOrder: Order = {
                  id: response.data._id,
                  date: new Date(response.data.createdAt),
                  status: response.data.status,
                  items: items.map(item => ({
                    id: item.id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.image,
                    selectedOptions: item.selectedOptions
                  })),
                  total: response.data.totalPrice,
                  subtotal: response.data.itemsPrice,
                  tax: response.data.taxPrice,
                  shipping: response.data.shippingPrice,
                  shippingAddress,
                  paymentMethod,
                  estimatedDelivery: response.data.estimatedDelivery ? new Date(response.data.estimatedDelivery) : addDays(new Date(), 3),
                  trackingNumber: response.data.trackingNumber || generateTrackingNumber(),
                  orderNotes: response.data.notes
                };                set(state => ({
                  orders: [newOrder, ...state.orders],
                  loading: false
                }));

                toast.success('Order placed successfully and saved to your account!');
                console.log('Order successfully created via API:', newOrder);
                
                // Refresh orders from database to ensure consistency
                setTimeout(() => {
                  get().fetchOrders();
                }, 1000);
                
                return newOrder;
              } catch (apiError: any) {
                console.error('API order creation failed:', apiError);
                const errorMessage = apiError.response?.data?.message || 'Failed to create order via API';
                console.error('Full API error:', apiError);
                
                // Show specific error message
                toast.error(`Order creation failed: ${errorMessage}`);
                set({ loading: false, error: errorMessage });
                throw apiError; // Re-throw to handle in payment form
              }
            }

            // User not authenticated - create local order
            console.warn('User not authenticated, creating local order');
            toast.info('Please log in to save orders to your account. Order created locally.');
            
            // Create fallback local order
            const orderId = generateOrderId();
            const trackingNumber = generateTrackingNumber();
            const orderDate = new Date();
            const estimatedDelivery = addDays(orderDate, 3);

            const fallbackOrder: Order = {
              id: orderId,
              date: orderDate,
              status: 'processing',
              items: items.map(item => ({
                id: item.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                image: item.product.image,
                selectedOptions: item.selectedOptions
              })),
              total: totals.total,
              subtotal: totals.subtotal,
              tax: totals.tax,
              shipping: totals.shipping,
              shippingAddress,
              paymentMethod,
              estimatedDelivery,
              trackingNumber,
              orderNotes: undefined
            };

            set(state => ({
              orders: [fallbackOrder, ...state.orders],
              loading: false
            }));            console.log('Fallback order created:', fallbackOrder);
            return fallbackOrder;
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create order';
            console.error('Order creation error:', errorMessage, error);
            set({ loading: false, error: errorMessage });
            
            // Create emergency fallback order
            const orderId = generateOrderId();
            const trackingNumber = generateTrackingNumber();
            const orderDate = new Date();
            const estimatedDelivery = addDays(orderDate, 3);

            const emergencyOrder: Order = {
              id: orderId,
              date: orderDate,
              status: 'processing',
              items: items.map(item => ({
                id: item.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                image: item.product.image,
                selectedOptions: item.selectedOptions
              })),
              total: totals.total,
              subtotal: totals.subtotal,
              tax: totals.tax,
              shipping: totals.shipping,
              shippingAddress,
              paymentMethod,
              estimatedDelivery,
              trackingNumber,
              orderNotes: undefined
            };

            set(state => ({
              orders: [emergencyOrder, ...state.orders],
              loading: false
            }));

            toast.error('Order saved locally due to technical issues.');
            return emergencyOrder;
          }
        },

        // Fetch orders from API
        fetchOrders: async () => {
          set({ loading: true, error: null });
          
          try {
            // Check if user is authenticated
            const token = typeof window !== 'undefined' ? localStorage.getItem('aquanest_token') : null;
              if (!token) {
              // User not authenticated, clear orders and don't try to fetch from API
              console.log('User not authenticated, clearing orders');
              set({ orders: [], loading: false });
              return;
            }

            console.log('Fetching user orders from database...');const response = await ordersAPI.getUserOrders();
            const apiOrders = response.data.map((order: any) => ({
              id: order._id,
              date: new Date(order.createdAt),
              status: order.status,
              items: order.orderItems?.map((item: any) => ({
                id: item.product?._id || item.product,
                name: item.name || item.product?.name || 'Unknown Product',
                quantity: item.quantity,
                price: item.price,
                image: item.product?.images?.[0]?.url || item.product?.image
              })) || [],
              total: order.totalPrice,
              subtotal: order.itemsPrice,
              tax: order.taxPrice,
              shipping: order.shippingPrice,
              shippingAddress: order.shippingAddress,
              paymentMethod: { type: order.paymentMethod },
              estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
              trackingNumber: order.trackingNumber,
              orderNotes: order.notes
            }));

            // Only show database orders for authenticated users
            // Local orders are only for demo/offline purposes and should not appear in user history
            set({ orders: apiOrders, loading: false });
            console.log('Fetched orders from database:', apiOrders.length);          } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch orders';
            set({ loading: false, error: errorMessage });
            console.error('Error fetching orders:', error);
            
            // If API fails, clear orders instead of showing stale/local data
            set({ orders: [] });
          }
        },

        // Get order by ID
        getOrderById: (orderId) => {
          const { orders } = get();
          return orders.find(order => order.id === orderId);
        },

        // Get orders by status
        getOrdersByStatus: (status) => {
          const { orders } = get();
          return orders.filter(order => order.status === status);
        },

        // Update order status
        updateOrderStatus: (orderId, status) => {
          set(state => ({
            orders: state.orders.map(order =>
              order.id === orderId ? { ...order, status } : order
            )
          }));
        },

        // Clear all orders (for development/testing)
        clearOrders: () => set({ orders: [] })
      };    },
    {
      name: 'aquanest-orders',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Don't persist orders - always fetch fresh from database for authenticated users
      // Only persist demo orders temporarily for cart-demo functionality
      partialize: (state) => {
        // Check if user is authenticated
        const token = typeof window !== 'undefined' ? localStorage.getItem('aquanest_token') : null;
        
        if (token) {
          // User is authenticated - don't persist orders, they should come from database
          return {};
        } else {
          // User not authenticated - persist only demo orders for cart-demo functionality
          const demoOrders = state.orders.filter(order => 
            order.id.startsWith('AQ') && !order.id.match(/^[0-9a-fA-F]{24}$/)
          );
          return { orders: demoOrders };
        }
      },
    }
  )
);
