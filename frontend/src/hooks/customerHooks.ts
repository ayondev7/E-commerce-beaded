"use client";
import { useQuery } from "@tanstack/react-query";
import AUTH_ROUTES from "@/routes/authRoutes";
import apiClient from "./apiClient";

export type MeResponse = {
	id?: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
};

export const fetchMe = async (): Promise<MeResponse> => {
	const { data } = await apiClient.get(AUTH_ROUTES.me);
	return data;
};

export function useMe() {
	return useQuery({
		queryKey: ["auth", "me"],
		queryFn: fetchMe,
		staleTime: 1000 * 60, 
		retry: 1,
	});
}

