"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ADDRESS_ROUTES from "@/routes/addressRoutes";
import apiClient from "./apiClient";
import {
  Address,
  AddressListResponse,
  CreateAddressPayload,
  UpdateAddressPayload
} from "@/types";

export const fetchAddressList = async () => {
  const { data } = await apiClient.get(ADDRESS_ROUTES.list);
  return data as AddressListResponse;
};

export function useAddressList() {
  return useQuery({
    queryKey: ["addresses", "list"],
    queryFn: fetchAddressList,
    staleTime: 60_000,
  });
}

export const createAddress = async (payload: CreateAddressPayload) => {
  const { data } = await apiClient.post(ADDRESS_ROUTES.create, payload);
  return data;
};

export function useCreateAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", "list"] });
    },
  });
}

export const updateAddress = async (id: string | number, payload: UpdateAddressPayload) => {
  const { data } = await apiClient.patch(ADDRESS_ROUTES.update(id), payload);
  return data;
};

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateAddressPayload }) =>
      updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", "list"] });
    },
  });
}

export const setDefaultAddress = async (id: string | number) => {
  const { data } = await apiClient.patch(ADDRESS_ROUTES.setDefault(id));
  return data;
};

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", "list"] });
    },
  });
}

export const removeDefaultAddress = async (id: string | number) => {
  const { data } = await apiClient.patch(ADDRESS_ROUTES.removeDefault(id));
  return data;
};

export function useRemoveDefaultAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", "list"] });
    },
  });
}

export const deleteAddress = async (id: string | number) => {
  const { data } = await apiClient.delete(ADDRESS_ROUTES.delete(id));
  return data;
};

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", "list"] });
    },
  });
}