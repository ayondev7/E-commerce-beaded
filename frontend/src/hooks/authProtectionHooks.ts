"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/routes/authRoutes";

type AuthVerificationResponse = {
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

type AuthState = {
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

export function useAuthProtection() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
    customer: null,
  });

  const verifyAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // If no session, redirect to login
      if (!session?.accessToken || !session?.refreshToken) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          error: "No valid session found",
          customer: null,
        });
        return false;
      }

      // Call backend verify endpoint
      const response = await fetch(AUTH_ROUTES.verify, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
          "x-refresh-token": session.refreshToken,
        },
      });

      const data: AuthVerificationResponse = await response.json();

      switch (data.action) {
        case "ALLOW_ACCESS":
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            error: null,
            customer: data.customer || null,
          });
          return true;

        case "UPDATE_ACCESS_TOKEN":
          // Update session with new access token
          if (data.accessToken) {
            await update({
              ...session,
              accessToken: data.accessToken,
            });
          }
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            error: null,
            customer: data.customer || null,
          });
          return true;

        case "REDIRECT_TO_LOGIN":
        default:
          // Sign out and redirect to login
          await signOut({ redirect: false });
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            error: data.message || "Authentication failed",
            customer: null,
          });
          return false;
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        error: "Network error during authentication",
        customer: null,
      });
      return false;
    }
  }, [session, update]);

  const redirectToLogin = useCallback(() => {
    router.push("/sign-in");
  }, [router]);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  return {
    ...authState,
    verifyAuth,
    redirectToLogin,
  };
}