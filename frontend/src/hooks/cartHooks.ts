"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import CART_ROUTES from "@/routes/cartRoutes";
import apiClient from "./apiClient";
import { 
  CartItem, 
  CartListResponse, 
  AddToCartPayload, 
  UpdateCartItemPayload, 
  CartCountResponse 
} from "@/types";

export const fetchCartList = async () => {
  const { data } = await apiClient.get(CART_ROUTES.list);
  return data as CartListResponse;
};

export function useCartList() {
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ["cart", "list"],
    queryFn: fetchCartList,
    staleTime: 60_000,
    enabled: !!session?.accessToken,
  });
}

export const fetchCartCount = async () => {
  const { data } = await apiClient.get(CART_ROUTES.count);
  return data as CartCountResponse;
};

export function useCartCount() {
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ["cart", "count"],
    queryFn: fetchCartCount,
    staleTime: 60_000,
    enabled: !!session?.accessToken,
  });
}

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
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist", "list"] });
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
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist", "list"] });
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
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist", "list"] });
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
      queryClient.invalidateQueries({ queryKey: ["cart", "count"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist", "list"] });
    },
  });
}