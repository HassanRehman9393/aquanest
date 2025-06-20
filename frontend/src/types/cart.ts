// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'water' | 'accessories' | 'subscription';
  inStock: boolean;
  volume?: string; // e.g., "500ml", "1L", "5L"
  features?: string[];
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions?: {
    size?: string;
    subscription?: 'one-time' | 'weekly' | 'monthly';
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  updatedAt: Date;
}

// Order Types
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'cash_on_delivery';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface Order {
  id: string;
  date: Date;  // Changed from createdAt to date for consistency
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    selectedOptions?: {
      size?: string;
      subscription?: 'one-time' | 'weekly' | 'monthly';
    };
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery: Date;
  trackingNumber?: string;
  orderNotes?: string;
}

// Checkout Types
export interface CheckoutState {
  step: 'cart' | 'shipping' | 'payment' | 'confirmation';
  shippingAddress?: ShippingAddress;
  paymentMethod?: PaymentMethod;
  isProcessing: boolean;
  error?: string;
}
