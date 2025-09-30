"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ORDER_ROUTES from "@/routes/orderRoutes";
import apiClient from "./apiClient";
import {
  OrderCart,
  OrderAddress,
  Order,
  OrdersListResponse,
  OrderDetailResponse,
  CreateOrderPayload,
  UpdateOrderStatusPayload
} from "@/types";

export const fetchUserOrders = async (): Promise<OrdersListResponse> => {
  const { data } = await apiClient.get(ORDER_ROUTES.getUserOrders);
  return data;
};

export const fetchOrderById = async (orderId: string): Promise<OrderDetailResponse> => {
  const { data } = await apiClient.get(ORDER_ROUTES.getOrderById(orderId));
  return data;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await apiClient.post(ORDER_ROUTES.createOrder, payload);
  return data;
};

export const updateOrderStatus = async (orderId: string, payload: UpdateOrderStatusPayload) => {
  const { data } = await apiClient.patch(ORDER_ROUTES.updateOrderStatus(orderId), payload);
  return data;
};

export const cancelOrder = async (orderId: string) => {
  const { data } = await apiClient.patch(ORDER_ROUTES.cancelOrder(orderId));
  return data;
};

export function useUserOrders() {
  return useQuery({
    queryKey: ["orders", "list"],
    queryFn: fetchUserOrders,
    staleTime: 60_000,
  });
}

export function useOrderById(orderId: string) {
  return useQuery({
    queryKey: ["orders", "detail", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
    staleTime: 60_000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: UpdateOrderStatusPayload }) =>
      updateOrderStatus(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "detail"] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "detail"] });
    },
  });
}
