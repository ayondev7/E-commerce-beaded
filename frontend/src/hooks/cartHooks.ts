"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CART_ROUTES from "@/routes/cartRoutes";
import apiClient from "./apiClient";
import { Product } from "./productHooks";

// Types
export type CartItem = {
  id: string;
  quantity: number;
  subTotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  customerId: string;
  productId: string;
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
  subTotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
};

export type UpdateCartItemPayload = {
  quantity?: number;
  subTotal?: number;
  deliveryFee?: number;
  discount?: number;
  grandTotal?: number;
};

// Queries
export const fetchCartList = async () => {
  const { data } = await apiClient.get(CART_ROUTES.list);
  return data as CartListResponse;
};

export function useCartList() {
  return useQuery({
    queryKey: ["cart", "list"],
    queryFn: fetchCartList,
    staleTime: 60_000,
  });
}

// Mutations
export const addToCart = async (payload: AddToCartPayload) => {
  const { data } = await apiClient.post(CART_ROUTES.addToCart, payload);
  return data;
};

export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", "list"] });
    },
  });
}

export const updateCartItem = async (id: string | number, payload: UpdateCartItemPayload) => {
  const { data } = await apiClient.patch(CART_ROUTES.update(id), payload);
  return data;
};

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateCartItemPayload }) =>
      updateCartItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", "list"] });
    },
  });
}

export const removeFromCart = async (id: string | number) => {
  const { data } = await apiClient.delete(CART_ROUTES.remove(id));
  return data;
};

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", "list"] });
    },
  });
}

export const clearCart = async () => {
  const { data } = await apiClient.delete(CART_ROUTES.clear);
  return data;
};

export function useClearCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", "list"] });
    },
  });
}