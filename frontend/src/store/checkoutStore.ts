import { create } from 'zustand';
import { CheckoutState, ShippingAddress, PaymentMethod, Order } from '@/types/cart';

interface CheckoutStore extends CheckoutState {
  // Actions
  setStep: (step: CheckoutState['step']) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | undefined) => void;
  resetCheckout: () => void;
  
  // Validation
  canProceedToPayment: () => boolean;
  canProceedToConfirmation: () => boolean;
}

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  // Initial state
  step: 'cart',
  shippingAddress: undefined,
  paymentMethod: undefined,
  isProcessing: false,
  error: undefined,  // Actions
  setStep: (step) => set({ step, error: undefined }),
  
  setShippingAddress: (address) => set({ shippingAddress: address }),
  
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  
  setProcessing: (isProcessing) => set({ isProcessing }),
  
  setError: (error) => set({ error }),
  
  resetCheckout: () => set({
    step: 'cart',
    shippingAddress: undefined,
    paymentMethod: undefined,
    isProcessing: false,
    error: undefined,
  }),

  // Validation methods
  canProceedToPayment: () => {
    const { shippingAddress } = get();
    return !!shippingAddress && 
           !!shippingAddress.firstName &&
           !!shippingAddress.lastName &&
           !!shippingAddress.email &&
           !!shippingAddress.address &&
           !!shippingAddress.city &&
           !!shippingAddress.zipCode;
  },

  canProceedToConfirmation: () => {
    const { paymentMethod, shippingAddress } = get();
    const hasValidShipping = get().canProceedToPayment();
    const hasValidPayment = !!paymentMethod && !!paymentMethod.type;
    
    if (paymentMethod?.type === 'card') {
      return hasValidShipping && 
             hasValidPayment &&
             !!paymentMethod.cardNumber &&
             !!paymentMethod.expiryDate &&
             !!paymentMethod.cvv &&
             !!paymentMethod.cardholderName;
    }
    
    return hasValidShipping && hasValidPayment;
  },
}));
