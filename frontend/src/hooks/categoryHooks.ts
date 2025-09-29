"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CATEGORY_ROUTES from "@/routes/categoryRoutes";
import apiClient from "./apiClient";

export type Category = {
	id: string | number;
	name: string;
	description?: string;
	image?: string;
};

export const fetchCategoryList = async () => {
	const { data } = await apiClient.get(CATEGORY_ROUTES.list);
	return data as Category[];
};

export function useCategoryList() {
	return useQuery({
		queryKey: ["categories", "list"],
		queryFn: fetchCategoryList,
		staleTime: 60_000,
	});
}

export const fetchCategory = async (id: string | number) => {
	const { data } = await apiClient.get(CATEGORY_ROUTES.detail(id));
	return data as Category;
};

export function useCategory(id: string | number | undefined) {
	return useQuery({
		queryKey: ["categories", "detail", id],
		queryFn: () => fetchCategory(id as string | number),
		enabled: !!id,
		staleTime: 60_000,
	});
}

type CategoryPayload = FormData | Record<string, any>;

const toFormData = (payload: CategoryPayload) => {
	if (payload instanceof FormData) return payload;
	const fd = new FormData();
	Object.entries(payload).forEach(([k, v]) => {
		if (v !== undefined && v !== null) fd.append(k, v as any);
	});
	return fd;
};

export function useCreateCategory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CategoryPayload) => {
			const formData = toFormData(payload);
			const { data } = await apiClient.post(CATEGORY_ROUTES.create, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return data as Category;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["categories", "list"] });
		},
	});
}

export function useUpdateCategory(categoryId: string | number) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CategoryPayload) => {
			const formData = toFormData(payload);
			const { data } = await apiClient.patch(CATEGORY_ROUTES.update(categoryId), formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return data as Category;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["categories", "detail", categoryId] });
			qc.invalidateQueries({ queryKey: ["categories", "list"] });
		},
	});
}

export function useDeleteCategory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (categoryId: string | number) => {
			const { data } = await apiClient.delete(CATEGORY_ROUTES.delete(categoryId));
			return data as { success: boolean };
		},
		onSuccess: (_, categoryId) => {
			qc.invalidateQueries({ queryKey: ["categories", "detail", categoryId] });
			qc.invalidateQueries({ queryKey: ["categories", "list"] });
		},
	});
}

