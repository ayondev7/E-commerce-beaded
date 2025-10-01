"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PRODUCT_ROUTES from "@/routes/productRoutes";
import apiClient from "./apiClient";
import { Product, ProductListResponse, CreateProductInput, ProductResponse } from "@/types";


export const fetchProductList = async (params?: Record<string, unknown>) => {
	const { data } = await apiClient.get(PRODUCT_ROUTES.list, { params });
	return data as ProductListResponse;
};

export function useProductList(params?: Record<string, unknown>) {
	return useQuery({
		queryKey: ["products", "list", params ?? {}],
		queryFn: () => fetchProductList(params),
		staleTime: 60_000,
	});
}

export const fetchProduct = async (slug: string) => {
	const { data } = await apiClient.get(PRODUCT_ROUTES.detail(slug));
	return data as ProductResponse;
};

export function useProduct(slug: string | undefined) {
	return useQuery({
		queryKey: ["products", "detail", slug],
		queryFn: () => fetchProduct(slug as string),
		enabled: !!slug,
		staleTime: 60_000,
	});
}

export function useBestSellers() {
	return useQuery({
		queryKey: ["products", "best-sellers"],
		queryFn: async () => (await apiClient.get(PRODUCT_ROUTES.bestSellers)).data as Product[],
		staleTime: 60_000,
	});
}

export function useLatestCollection() {
	return useQuery({
		queryKey: ["products", "latest-collection"],
		queryFn: async () => (await apiClient.get(PRODUCT_ROUTES.latestCollection)).data as Product[],
		staleTime: 60_000,
	});
}

export function useExclusiveCollection() {
  return useQuery({
    queryKey: ["products", "exclusive-collection"],
    queryFn: async () => (await apiClient.get(PRODUCT_ROUTES.exclusiveCollection)).data as Product[],
    staleTime: 60_000,
  });
}

const toFormData = (payload: CreateProductInput) => {
	if (payload instanceof FormData) return payload;
	const fd = new FormData();
	Object.entries(payload).forEach(([k, v]) => {
		if (Array.isArray(v)) {
			v.forEach((item) => {
				if (item instanceof Blob) fd.append(k, item);
				else fd.append(k, String(item));
			});
		} else if (v !== undefined && v !== null) {
			if (v instanceof Blob) fd.append(k, v);
			else fd.append(k, String(v));
		}
	});
	return fd;
};

export function useCreateProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateProductInput) => {
			const formData = toFormData(payload);
			const { data } = await apiClient.post(PRODUCT_ROUTES.create, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return data as Product;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products", "list"] });
			qc.invalidateQueries({ queryKey: ["products", "best-sellers"] });
			qc.invalidateQueries({ queryKey: ["products", "latest-collection"] });
		},
	});
}

export function useUpdateProduct(productId: string | number) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateProductInput) => {
			const formData = toFormData(payload);
			const { data } = await apiClient.patch(PRODUCT_ROUTES.update(productId), formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return data as Product;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products", "detail", productId] });
			qc.invalidateQueries({ queryKey: ["products", "list"] });
		},
	});
}

export function useDeleteProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (productId: string | number) => {
			const { data } = await apiClient.delete(PRODUCT_ROUTES.delete(productId));
			return data as { success: boolean };
		},
		onSuccess: (_, productId) => {
			qc.invalidateQueries({ queryKey: ["products", "detail", productId] });
			qc.invalidateQueries({ queryKey: ["products", "list"] });
		},
	});
}

