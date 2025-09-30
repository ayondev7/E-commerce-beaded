"use client";

import React, { useEffect } from "react";
import { FiLoader } from "react-icons/fi";
import { useAuthProtection } from "@/hooks/authProtectionHooks";

interface RouteProtectorProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center">
      <FiLoader className="animate-spin size-[40px] text-[#00B5A5] mb-5" />
      <p className="text-lg font-semibold">Loading...</p>
    </div>
  </div>
);

export default function RouteProtector({ children, fallback }: RouteProtectorProps) {
  const { isLoading, isAuthenticated, error, redirectToLogin } = useAuthProtection();

  // Auto-redirect timer when not authenticated (must be at top level)
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // Redirect immediately instead of showing error
      redirectToLogin();
    }
  }, [isAuthenticated, isLoading, redirectToLogin]);

  // If still loading authentication check, show loading spinner
  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  // If not authenticated, just return null (redirect will happen via useEffect)
  if (!isAuthenticated) {
    return null;
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