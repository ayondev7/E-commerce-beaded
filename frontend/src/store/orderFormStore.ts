import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DeliveryInfo, OrderFormData, OrderFormStore } from '@/types';

const initialOrderData: OrderFormData = {
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
          return newState;
        });
      },
      
      resetOrderForm: () => {
        set({ orderData: initialOrderData });
      },
    }),
    {
      name: 'order-form-storage',
      partialize: (state) => ({ orderData: state.orderData }),
    }
  )
);