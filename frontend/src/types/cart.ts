import { Product } from './product';

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product & {
    category: {
      id: string;
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
};

export type CartListResponse = {
  cartItems: CartItem[];
};

export type AddToCartPayload = {
  productId: string;
  quantity: number;
};

export type UpdateCartItemPayload = {
  quantity: number;
};

export type CartCountResponse = {
  count: number;
};

export type CartCalculationItem = {
  id: string;
  product: {
    price: number;
    offerPrice?: number;
  };
  quantity: number;
};

export type QuantityChange = {
  cartItemId: string;
  newQuantity: number;
};

export type CartTotals = {
  subTotal: number;
  totalDiscount: number;
  deliveryFee: number;
  grandTotal: number;
};