"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WISHLIST_ROUTES from "@/routes/wishlistRoutes";
import apiClient from "./apiClient";
import { Product } from "./productHooks";

// Types
export type WishlistItem = {
  id: string;
  customerId: string;
  productId: string;
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
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type WishlistListResponse = {
  wishlistItems: WishlistItem[];
};

export type AddToWishlistPayload = {
  productId: string;
};

// Queries
export const fetchWishlistList = async () => {
  const { data } = await apiClient.get(WISHLIST_ROUTES.list);
  return data as WishlistListResponse;
};

export function useWishlistList() {
  return useQuery({
    queryKey: ["wishlist", "list"],
    queryFn: fetchWishlistList,
    staleTime: 60_000,
  });
}

// Mutations
export const addToWishlist = async (payload: AddToWishlistPayload) => {
  const { data } = await apiClient.post(WISHLIST_ROUTES.addToWishlist, payload);
  return data;
};

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", "list"] });
    },
  });
}

export const removeFromWishlist = async (id: string | number) => {
  const { data } = await apiClient.delete(WISHLIST_ROUTES.remove(id));
  return data;
};

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", "list"] });
    },
  });
}

export const clearWishlist = async () => {
  const { data } = await apiClient.delete(WISHLIST_ROUTES.clear);
  return data;
};

export function useClearWishlist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clearWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", "list"] });
    },
  });
}