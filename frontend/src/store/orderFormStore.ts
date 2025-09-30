import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DeliveryInfo, OrderFormData, OrderFormStore } from '@/types';

const initialOrderData: OrderFormData = {
  cartId: undefined,
  orderId: undefined,
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
          console.log('🛒 Cart ID Updated:', cartId);
          return newState;
        });
      },
      
      setOrderId: (orderId: string) => {
        set((state) => {
          const newState = {
            ...state,
            orderData: {
              ...state.orderData,
              orderId,
            },
          };
          console.log('📦 Order ID Updated:', orderId);
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