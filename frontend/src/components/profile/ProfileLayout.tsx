"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { Tabs } from "@/components/profile/Tabs";
import { useMe } from "@/hooks/customerHooks";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: customerData, isLoading } = useMe();

  // Map pathnames to tab values
  const getTabFromPath = (path: string): "profile" | "addresses" | "orders" | "wishlist" => {
    if (path.includes("/address")) return "addresses";
    if (path.includes("/orders")) return "orders";
    if (path.includes("/wishlist")) return "wishlist";
    return "profile";
  };

  const currentTab = getTabFromPath(pathname);

  const handleTabChange = (tab: "profile" | "addresses" | "orders" | "wishlist") => {
    switch (tab) {
      case "profile":
        router.push("/profile");
        break;
      case "addresses":
        router.push("/address");
        break;
      case "orders":
        router.push("/orders");
        break;
      case "wishlist":
        router.push("/wishlist");
        break;
    }
  };

  // Show loading state if customer data is not available
  if (isLoading) {
    return (
      <div className="pb-16 flex justify-center w-full overflow-y-auto">
        <div className="w-[1000px] overflow-x-hidden">
          <div className="flex justify-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 flex justify-center w-full overflow-y-auto">
      <div className="w-[1000px] overflow-x-hidden">
        <ProfileHeader />
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
        />
        
        <div className="mt-[67px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;