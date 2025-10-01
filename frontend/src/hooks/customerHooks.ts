"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import AUTH_ROUTES from "@/routes/authRoutes";
import apiClient from "./apiClient";
import { MeResponse, UpdateMeRequest } from "@/types";

export const fetchMe = async (): Promise<MeResponse> => {
	const { data } = await apiClient.get(AUTH_ROUTES.me);
	return data;
};

export const updateMe = async (updateData: UpdateMeRequest): Promise<MeResponse> => {
	const { data } = await apiClient.patch(AUTH_ROUTES.updateMe, updateData);
	return data;
};

export function useMe() {
	const { data: session } = useSession();
	
	return useQuery({
		queryKey: ["auth", "me"],
		queryFn: fetchMe,
		staleTime: 1000 * 60 * 30,
		retry: 1,
		// Only run the query if user is authenticated
		enabled: !!session?.accessToken,
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