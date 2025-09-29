"use client";

import React, { useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { useAuthProtection } from "@/hooks/authProtectionHooks";

interface RouteProtectorProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600 text-lg">Verifying authentication...</p>
      <p className="text-gray-400 text-sm mt-2">Please wait while we check your credentials</p>
    </div>
  </div>
);

const UnauthorizedFallback = ({ error }: { error?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="text-red-500 text-6xl mb-4">🔒</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-4">{error || "You need to be logged in to access this page"}</p>
      <button
        onClick={() => window.location.href = "/sign-in"}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go to Sign In
      </button>
    </div>
  </div>
);

export default function RouteProtector({ children, fallback }: RouteProtectorProps) {
  const { isLoading, isAuthenticated, error, redirectToLogin } = useAuthProtection();

  // If still loading authentication check, show loading spinner
  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  // If not authenticated, show unauthorized fallback
  if (!isAuthenticated) {
    // Optionally auto-redirect after showing error briefly
    useEffect(() => {
      const timer = setTimeout(() => {
        redirectToLogin();
      }, 3000);
      return () => clearTimeout(timer);
    }, [redirectToLogin]);

    return <UnauthorizedFallback error={error || undefined} />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}

// Higher-order component version for easier wrapping
export function withRouteProtection<P extends object>(
  Component: React.ComponentType<P>,
  customFallback?: React.ReactNode
) {
  const ProtectedComponent = (props: P) => (
    <RouteProtector fallback={customFallback}>
      <Component {...props} />
    </RouteProtector>
  );

  ProtectedComponent.displayName = `withRouteProtection(${Component.displayName || Component.name})`;
  
  return ProtectedComponent;
}