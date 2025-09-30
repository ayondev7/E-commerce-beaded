import { Address } from './address';

export type OrderCart = {
  id: string;
  productId: string;
  customerId: string;
  quantity: number;
  subTotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
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
  cartId: string;
  addressId: string;
  notes: string;
  orderStatus: "pending" | "shipped" | "delivered" | "cancelled";
  cart: OrderCart;
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
  cartId: string;
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
  cartId?: string;
  orderId?: string;
  deliveryInfo: DeliveryInfo;
  currentStep: number;
};

export interface OrderFormStore {
  orderData: OrderFormData;
  setDeliveryInfo: (deliveryInfo: DeliveryInfo) => void;
  setCartId: (cartId: string) => void;
  setOrderId: (orderId: string) => void;
  setCurrentStep: (step: number) => void;
  resetOrderForm: () => void;
}