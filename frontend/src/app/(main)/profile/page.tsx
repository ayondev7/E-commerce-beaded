"use client";
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { Tabs } from "@/components/profile/Tabs";
import ProfileInfoView, {
  type ProfileData,
} from "@/components/profile/ProfileInfoView";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import Addresses from "@/components/profile/Addresses";
import OrdersList from "@/components/profile/OrdersList";
import WishlistGrid from "@/components/profile/WishlistGrid";
import ViewDetailsModal, { type OrderDetails } from "@/components/profile/ViewDetailsModal";

const ProfilePage = () => {
  const [tab, setTab] = React.useState<
    "profile" | "addresses" | "orders" | "wishlist"
  >("profile");
  const [editing, setEditing] = React.useState(false);
  const [profile, setProfile] = React.useState<ProfileData>({
    firstName: "Jenny",
    lastName: "Wilson",
    email: "info@example.com",
    phone: "01234567890",
    gender: "Male",
    dob: "1999-12-15",
  });

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<OrderDetails | null>(
    null
  );

  return (
    <div className="pb-16 flex justify-center w-full">
      <div className="w-[1000px] overflow-x-hidden">
        <ProfileHeader name={`${profile.firstName} ${profile.lastName}`} />
        <Tabs
          value={tab}
          onChange={(t) => {
            setTab(t);
            if (t !== "profile") setEditing(false);
          }}
        />

        <div className="mt-[67px]">
          {tab === "profile" &&
            (editing ? (
              <ProfileInfoForm
                initial={profile}
                onCancel={() => setEditing(false)}
                onSave={(data) => {
                  setProfile(data);
                  setEditing(false);
                }}
              />
            ) : (
              <ProfileInfoView data={profile} onEdit={() => setEditing(true)} />
            ))}

          {tab === "addresses" && <Addresses />}
          {tab === "orders" && (
            <>
              <OrdersList
                onViewDetails={(details) => {
                  setSelectedOrder(details);
                  setModalOpen(true);
                }}
              />
              <ViewDetailsModal
                open={modalOpen}
                details={selectedOrder}
                onClose={() => setModalOpen(false)}
              />
            </>
          )}
          {tab === "wishlist" && <WishlistGrid />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
