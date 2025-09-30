import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DeliveryInfo {
  selectedAddressId: string;
  notes: string;
}

export interface OrderFormData {
  // Essential data only
  cartId?: string;
  deliveryInfo: DeliveryInfo;
  currentStep: number;
}

interface OrderFormStore {
  orderData: OrderFormData;
  
  // Actions
  setDeliveryInfo: (deliveryInfo: DeliveryInfo) => void;
  setCartId: (cartId: string) => void;
  setCurrentStep: (step: number) => void;
  
  // Reset store
  resetOrderForm: () => void;
}

const initialOrderData: OrderFormData = {
  cartId: undefined,
  deliveryInfo: {
    selectedAddressId: '',
    notes: '',
  },
  currentStep: 1,
};

export const useOrderFormStore = create<OrderFormStore>()(
  persist(
    (set, get) => ({
      orderData: initialOrderData,
      
      setDeliveryInfo: (deliveryInfo: DeliveryInfo) => {
        set((state) => {
          const newState = {
            ...state,
            orderData: {
              ...state.orderData,
              deliveryInfo,
            },
          };
          console.log('🚚 Delivery Info Updated:', deliveryInfo);
          return newState;
        });
      },
      
      setCartId: (cartId: string) => {
        set((state) => {
          const newState = {
            ...state,
            orderData: {
              ...state.orderData,
              cartId,
            },
          };
          console.log('� Cart ID Updated:', cartId);
          return newState;
        });
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
          console.log(`📍 Step Changed to: ${step}`);
          return newState;
        });
      },
      
      resetOrderForm: () => {
        set({ orderData: initialOrderData });
        console.log('🔄 Order Form Reset');
      },
    }),
    {
      name: 'order-form-storage',
      partialize: (state) => ({ orderData: state.orderData }),
    }
  )
);