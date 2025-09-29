"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PRODUCT_ROUTES from "@/routes/productRoutes";
import apiClient from "./apiClient";

// Types
export type Product = {
	id: string;
	name: string;
	price: number;
	description?: string;
	images?: string[];
	// ...extend as your backend returns
};

export type ProductListResponse = {
	items: Product[];
	total?: number;
	page?: number;
	pageSize?: number;
} | Product[];

// Queries
export const fetchProductList = async (params?: Record<string, any>) => {
	const { data } = await apiClient.get(PRODUCT_ROUTES.list, { params });
	return data as ProductListResponse;
};

export function useProductList(params?: Record<string, any>) {
	return useQuery({
		queryKey: ["products", "list", params ?? {}],
		queryFn: () => fetchProductList(params),
		staleTime: 60_000,
	});
}

export const fetchProduct = async (id: string | number) => {
	const { data } = await apiClient.get(PRODUCT_ROUTES.detail(id));
	return data as Product;
};

export function useProduct(id: string | number | undefined) {
	return useQuery({
		queryKey: ["products", "detail", id],
		queryFn: () => fetchProduct(id as string | number),
		enabled: !!id,
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

// Mutations
type CreateProductInput = FormData | Record<string, any>;

const toFormData = (payload: CreateProductInput) => {
	if (payload instanceof FormData) return payload;
	const fd = new FormData();
	Object.entries(payload).forEach(([k, v]) => {
		if (Array.isArray(v)) {
			v.forEach((item) => fd.append(k, item as any));
		} else if (v !== undefined && v !== null) {
			fd.append(k, v as any);
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

