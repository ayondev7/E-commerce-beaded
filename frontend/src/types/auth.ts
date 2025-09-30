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

export type AuthVerificationResponse = {
  success: boolean;
  message: string;
  action: "REDIRECT_TO_LOGIN" | "ALLOW_ACCESS" | "UPDATE_ACCESS_TOKEN";
  accessToken?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
};

export type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    image: string;
  } | null;
};

import type { Profile } from "next-auth";

export type GoogleProfile = Profile & {
  name?: string;
  email?: string;
  picture?: string;
};