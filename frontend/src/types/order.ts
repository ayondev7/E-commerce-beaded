import { Address } from './address';

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    categoryId: string;
    productCollection: string;
    productName: string;
    productDescription: string;
    productSlug: string;
    price: number;
    offerPrice?: number;
    images: string[];
    category: {
      id: string;
      name: string;
      image: string;
    };
  };
  createdAt: string;
  updatedAt: string;
};

export type OrderAddress = Address;

export type Order = {
  id: string;
  customerId: string;
  addressId: string;
  notes: string;
  orderStatus: "pending" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  address: OrderAddress;
  createdAt: string;
  updatedAt: string;
};

export type OrdersListResponse = {
  orders: Order[];
};

export type OrderDetailResponse = {
  order: Order;
};

export type CreateOrderPayload = {
  addressId: string;
  notes?: string;
};

export type UpdateOrderStatusPayload = {
  orderStatus: "cancelled";
};

export interface DeliveryInfo {
  selectedAddressId: string;
  notes: string;
}

export interface OrderFormData {
  orderId?: string;
  deliveryInfo: DeliveryInfo;
  currentStep: number;
};

export interface OrderFormStore {
  orderData: OrderFormData;
  setDeliveryInfo: (deliveryInfo: DeliveryInfo) => void;
  setOrderId: (orderId: string) => void;
  setCurrentStep: (step: number) => void;
  resetOrderForm: () => void;
}