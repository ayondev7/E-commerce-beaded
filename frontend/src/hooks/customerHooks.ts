"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AUTH_ROUTES from "@/routes/authRoutes";
import apiClient from "./apiClient";

export type MeResponse = {
	id?: string;
	name?: string | null;
	gender?: "male" | "female" | null;
	dateOfBirth?: string | null;
	phoneNumber?: string | null;
	email?: string | null;
	providerId?: string | null;
	image?: string | null;
	createdAt?: string;
	updatedAt?: string;
};

export type UpdateMeRequest = {
	name?: string;
	gender?: "male" | "female" | null;
	dateOfBirth?: string | null;
	phoneNumber?: string | null;
	email?: string;
	password?: string;
};

export const fetchMe = async (): Promise<MeResponse> => {
	const { data } = await apiClient.get(AUTH_ROUTES.me);
	return data;
};

export const updateMe = async (updateData: UpdateMeRequest): Promise<MeResponse> => {
	const { data } = await apiClient.patch(AUTH_ROUTES.updateMe, updateData);
	return data;
};

export function useMe() {
	return useQuery({
		queryKey: ["auth", "me"],
		queryFn: fetchMe,
		staleTime: 1000 * 60 * 30,
		retry: 1,
	});
}

export function useUpdateMe() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: updateMe,
		onSuccess: (data) => {
			queryClient.setQueryData(["auth", "me"], data);
		},
		onError: (error) => {
			console.error("Failed to update profile:", error);
		},
	});
}