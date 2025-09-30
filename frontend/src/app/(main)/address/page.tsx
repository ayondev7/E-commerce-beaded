"use client";
import React from "react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import Addresses from "@/components/profile/Addresses";
import { withRouteProtection } from "@/components/auth/RouteProtector";

const AddressPage = () => {
  return (
    <ProfileLayout>
      <Addresses />
    </ProfileLayout>
  );
};

export default withRouteProtection(AddressPage);