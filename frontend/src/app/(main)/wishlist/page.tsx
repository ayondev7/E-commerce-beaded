"use client";
import React from "react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import WishlistGrid from "@/components/profile/WishlistGrid";
import { withRouteProtection } from "@/components/auth/RouteProtector";

const WishlistPage = () => {
  return (
    <ProfileLayout>
      <WishlistGrid />
    </ProfileLayout>
  );
};

export default withRouteProtection(WishlistPage);