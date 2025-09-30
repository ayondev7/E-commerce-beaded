"use client";
import React from "react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import OrdersList from "@/components/profile/OrdersList";
import ViewDetailsModal from "@/components/profile/ViewDetailsModal";
import { withRouteProtection } from "@/components/auth/RouteProtector";

const OrdersPage = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

  return (
    <ProfileLayout>
      <OrdersList
        onViewDetails={(orderId) => {
          setSelectedOrderId(orderId);
          setModalOpen(true);
        }}
      />
      <ViewDetailsModal
        open={modalOpen}
        orderId={selectedOrderId}
        onClose={() => {
          setModalOpen(false);
          setSelectedOrderId(null);
        }}
      />
    </ProfileLayout>
  );
};

export default withRouteProtection(OrdersPage);