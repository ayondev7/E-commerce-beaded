import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AddressFormData {
  selectedAddressId: string;
  notes: string;
  selectedAddressDetails: {
    id?: string;
    division: string;
    district: string;
    zipCode: string;
    area: string;
    fullAddress: string;
    addressName?: string;
  } | null;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export interface OrderFormData {
  // Step 1: Cart data (usually comes from cart hook)
  cartItems: CartItem[];
  cartTotal: number;
  
  // Step 2: Delivery Info
  deliveryInfo: AddressFormData;
  
  // Step 3: Order Review & Payment
  paymentMethod: 'cash_on_delivery' | 'online';
  orderNotes?: string;
  
  // Current step tracking
  currentStep: number;
}

interface OrderFormStore {
  orderData: OrderFormData;
  
  // Actions
  setDeliveryInfo: (deliveryInfo: AddressFormData) => void;
  setPaymentMethod: (method: 'cash_on_delivery' | 'online') => void;
  setOrderNotes: (notes: string) => void;
  setCurrentStep: (step: number) => void;
  setCartData: (items: CartItem[], total: number) => void;
  
  // Reset store
  resetOrderForm: () => void;
  
  // Get current form state
  getCurrentFormData: () => OrderFormData;
}

const initialOrderData: OrderFormData = {
  cartItems: [],
  cartTotal: 0,
  deliveryInfo: {
    selectedAddressId: '',
    notes: '',
    selectedAddressDetails: null,
  },
  paymentMethod: 'cash_on_delivery',
  orderNotes: '',
  currentStep: 1,
};

export const useOrderFormStore = create<OrderFormStore>()(
  persist(
    (set, get) => ({
      orderData: initialOrderData,
      
      setDeliveryInfo: (deliveryInfo: AddressFormData) => {
        set((state) => {
          const newState = {
            ...state,
            orderData: {
              ...state.orderData,
              deliveryInfo,
            },
          };
          console.log('🚚 Delivery Info Updated:', {
            step: 'Step 2 - Delivery Info',
            data: deliveryInfo,
            fullOrderData: newState.orderData,
          });
          return newState;
        });
      },
      
      setPaymentMethod: (method: 'cash_on_delivery' | 'online') => {
        set((state) => {
          const newState = {
            ...state,
            orderData: {
              ...state.orderData,
              paymentMethod: method,
            },
          };
          console.log('💳 Payment Method Updated:', {
            step: 'Step 3 - Payment',
            paymentMethod: method,
            fullOrderData: newState.orderData,
          });
          return newState;
        });
      },
      
      setOrderNotes: (notes: string) => {
        set((state) => ({
          ...state,
          orderData: {
            ...state.orderData,
            orderNotes: notes,
          },
        }));
      },
      
      setCurrentStep: (step: number) => {
        set((state) => {
          const newState = {
            ...state,
            orderData: {
              ...state.orderData,
              currentStep: step,
            },
          };
          console.log(`📍 Step Changed to: ${step}`, {
            currentStep: step,
            fullOrderData: newState.orderData,
          });
          return newState;
        });
      },
      
      setCartData: (items: CartItem[], total: number) => {
        set((state) => {
          const newState = {
            ...state,
            orderData: {
              ...state.orderData,
              cartItems: items,
              cartTotal: total,
            },
          };
          console.log('🛒 Cart Data Updated:', {
            step: 'Step 1 - Cart',
            itemCount: items.length,
            total,
            items,
            fullOrderData: newState.orderData,
          });
          return newState;
        });
      },
      
      resetOrderForm: () => {
        set({ orderData: initialOrderData });
        console.log('🔄 Order Form Reset');
      },
      
      getCurrentFormData: () => {
        const currentData = get().orderData;
        console.log('📋 Current Form Data Retrieved:', currentData);
        return currentData;
      },
    }),
    {
      name: 'order-form-storage',
      partialize: (state) => ({ orderData: state.orderData }),
    }
  )
);