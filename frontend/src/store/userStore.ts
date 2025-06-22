import { create } from 'zustand';
import { ordersAPI } from '@/lib/api';
import { toast } from 'sonner';

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  statusBreakdown: Array<{
    status: string;
    count: number;
    totalAmount: number;
  }>;
}

interface UserStore {
  // Stats state (orders are handled by orderStore)
  stats: UserStats | null;
  statsLoading: boolean;
  statsError: string | null;
  
  // Actions
  fetchStats: () => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  clearErrors: () => void;
  refresh: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  stats: null,
  statsLoading: false,
  statsError: null,

  // Fetch user statistics
  fetchStats: async () => {
    set({ statsLoading: true, statsError: null });
    try {
      const response = await ordersAPI.getUserOrderStats();
      const stats = {
        totalOrders: response.data.totalOrders,
        totalSpent: response.data.totalSpent?.[0]?.total || 0,
        statusBreakdown: response.data.stats || []
      };
      
      set({ stats, statsLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch statistics';
      set({ statsError: errorMessage, statsLoading: false });
      console.error('Error fetching stats:', error);
    }
  },

  // Cancel an order
  cancelOrder: async (orderId: string) => {
    try {
      await ordersAPI.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      
      // Note: The actual order state is managed by orderStore
      // This function just handles the API call and notification
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel order';
      toast.error(errorMessage);
      throw error;
    }
  },

  // Clear errors
  clearErrors: () => {
    set({
      statsError: null
    });
  },

  // Refresh all data
  refresh: async () => {
    await get().fetchStats();
  }
}));