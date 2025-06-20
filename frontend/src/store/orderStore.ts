import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order, CartItem, ShippingAddress, PaymentMethod } from '@/types/cart';
import { addDays } from 'date-fns';

interface OrderStore {
  // State
  orders: Order[];
  
  // Actions
  createOrder: (items: CartItem[], shippingAddress: ShippingAddress, paymentMethod: PaymentMethod, totals: { total: number; subtotal: number; tax: number; shipping: number }) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: Order['status']) => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  clearOrders: () => void;
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
    (set, get) => ({
      // Initial state
      orders: [],

      // Create a new order
      createOrder: (items, shippingAddress, paymentMethod, totals) => {
        const orderId = generateOrderId();
        const trackingNumber = generateTrackingNumber();
        const orderDate = new Date();
        const estimatedDelivery = addDays(orderDate, 3); // 3 days from now

        const newOrder: Order = {
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
          orders: [newOrder, ...state.orders]
        }));

        return newOrder;
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
    }),
    {
      name: 'aquanest-orders',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
