"use client";
import React from "react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import OrdersList from "@/components/profile/OrdersList";
import ViewDetailsModal, { type OrderDetails } from "@/components/profile/ViewDetailsModal";
import { withRouteProtection } from "@/components/auth/RouteProtector";

const OrdersPage = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<OrderDetails | null>(
    null
  );

  return (
    <ProfileLayout>
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
    </ProfileLayout>
  );
};

export default withRouteProtection(OrdersPage);