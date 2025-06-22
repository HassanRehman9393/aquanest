import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { Product, CartItem, Cart } from '@/types/cart';

interface CartStore {
  // State
  items: CartItem[];
  isOpen: boolean;
  
  // Computed values
  total: number;
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  
  // Actions
  addItem: (product: Product, quantity?: number, options?: CartItem['selectedOptions']) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Helper methods
  getItem: (productId: string) => CartItem | undefined;
  calculateTotals: () => void;
}

const TAX_RATE = 0.08; // 8% tax
const SHIPPING_RATE = 5.99; // Flat shipping rate
const FREE_SHIPPING_THRESHOLD = 50; // Free shipping over $50

// Optimized calculation function
const calculateCartTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return {
    itemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const useCartStore = create<CartStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        items: [],
        isOpen: false,
        total: 0,
        itemCount: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,

        // Add item to cart
        addItem: (product, quantity = 1, options) => {
          const { items } = get();
          const existingItemIndex = items.findIndex(
            item => item.product.id === product.id &&
            JSON.stringify(item.selectedOptions) === JSON.stringify(options)
          );

          let newItems: CartItem[];

          if (existingItemIndex >= 0) {
            // Update existing item quantity
            newItems = items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `${product.id}-${Date.now()}`,
              product,
              quantity,
              selectedOptions: options,
            };
            newItems = [...items, newItem];
          }

          const totals = calculateCartTotals(newItems);
          set({ items: newItems, ...totals });
        },

        // Remove item from cart
        removeItem: (itemId) => {
          const { items } = get();
          const newItems = items.filter(item => item.id !== itemId);
          const totals = calculateCartTotals(newItems);
          set({ items: newItems, ...totals });
        },

        // Update item quantity
        updateQuantity: (itemId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(itemId);
            return;
          }

          const { items } = get();
          const newItems = items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          );
          const totals = calculateCartTotals(newItems);
          set({ items: newItems, ...totals });
        },

        // Clear entire cart
        clearCart: () => {
          set({ 
            items: [],
            total: 0,
            itemCount: 0,
            subtotal: 0,
            shipping: 0,
            tax: 0
          });
        },

        // Cart visibility
        openCart: () => set({ isOpen: true }),
        closeCart: () => set({ isOpen: false }),
        toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

        // Get specific item
        getItem: (productId) => {
          const { items } = get();
          return items.find(item => item.product.id === productId);
        },

        // Calculate totals (kept for backward compatibility)
        calculateTotals: () => {
          const { items } = get();
          const totals = calculateCartTotals(items);
          set(totals);
        },
      }),
      {
        name: 'aquanest-cart',
        storage: createJSONStorage(() => localStorage),
        // Only persist items, recalculate totals on hydration
        partialize: (state) => ({ items: state.items }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            const totals = calculateCartTotals(state.items);
            Object.assign(state, totals);
          }
        },
      }
    )
  )
);
