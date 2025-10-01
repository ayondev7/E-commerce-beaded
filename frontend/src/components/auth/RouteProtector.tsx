"use client";

import React, { useEffect, useState } from "react";
import LoaderComponent from "../generalComponents/LoaderComponent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface RouteProtectorProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LoadingSpinner = () => <LoaderComponent />;

export default function RouteProtector({ children, fallback }: RouteProtectorProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only check after session loading is complete
    if (status === "loading") return;
    
    if (status === "unauthenticated" || !session) {
      setIsRedirecting(true);
      router.push("/sign-in");
      return;
    }
  }, [session, status, router]);

  // Show loading while NextAuth is determining session status
  if (status === "loading") {
    return fallback || <LoadingSpinner />;
  }

  // Show loading while redirecting
  if (isRedirecting || status === "unauthenticated" || !session) {
    return fallback || <LoadingSpinner />;
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