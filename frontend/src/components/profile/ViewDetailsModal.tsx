"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useOrderById } from "@/hooks/orderHooks";
import { FiLoader } from "react-icons/fi";

export type OrderLine = {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  image: string;
};

export type OrderDetails = {
  id: string;
  date: string;
  status: string;
  items: OrderLine[];
  deliveryFee: number;
  discount: number;
  address: string;
  notes?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
  className?: string;
};

const currency = (n: number) =>
  `TK. ${n.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ModalOverlay = ({ onClose }: { onClose: () => void }) => (
  <div
    onMouseDown={onClose}
    className="absolute inset-0 backdrop-blur-[10px] bg-[rgba(0,0,0,0.5)]"
  />
);

const ModalHeader = ({
  id,
  date,
  status,
}: Pick<OrderDetails, "id" | "date" | "status">) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-sm font-semibold tracking-[-1%] text-[#9C9C9C] uppercase">
        Order ID:{" "}
        <span className="text-[#1E1E1E]">#{id.slice(-8).toUpperCase()}</span>
      </div>
      <div className="text-sm text-[#7D7D7D] mt-1">{date}</div>
    </div>
    <span className="px-[25px] py-2 bg-yellow-100 text-yellow-700 font-semibold uppercase text-xs">
      {status}
    </span>
  </div>
);

const OrderItemRow = ({ item }: { item: OrderLine }) => (
  <li className="flex items-center justify-between gap-4 py-5">
    <div className="flex items-center gap-4">
      <Image
        src={item.image}
        alt={item.name}
        width={80}
        height={80}
        className="w-20 h-20 object-cover"
      />
      <div>
        <div className="text-[#1E1E1E] font-medium leading-6">{item.name}</div>
      </div>
    </div>
    <div className="flex items-center gap-20">
      <div className="text-[#1E1E1E] text-xl font-medium">{item.qty}x</div>
      <div className="text-[#1E1E1E] font-medium text-xl">
        {currency(item.price)}
      </div>
    </div>
  </li>
);

const OrderItemsList = ({ items }: { items: OrderLine[] }) => (
  <div className="overflow-y-auto max-h-[50vh] hide-scrollbar">
    <ul className="divide-y divide-[#E6E6E6] border-r pr-[30px]">
      {items.map((it) => (
        <OrderItemRow key={it.id} item={it} />
      ))}
    </ul>
  </div>
);

const AddressSection = ({ address }: { address: string }) => (
  <div className="pt-12">
    <div>
      <h4 className="text-2xl font-semibold mb-2">Delivery Address</h4>
      <p className="text-[#545454] font-medium text-lg">{address}</p>
    </div>
  </div>
);

const SummarySection = ({
  subTotal,
  deliveryFee,
  discount,
  grandTotal,
  notes,
}: {
  subTotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  notes?: string;
}) => (
  <aside className="border-t md:border-t-0 pb-6 pl-[30px] pt-10 flex flex-col justify-between overflow-y-auto">
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[#7D7D7D] font-semibold">Sub-total</span>
        <span className="text-[#1E1E1E]">{currency(subTotal)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#7D7D7D] font-semibold">Delivery Fee</span>
        <span className="text-[#1E1E1E]">{currency(deliveryFee)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#7D7D7D] font-semibold">Discount</span>
        <span className="text-[#1E1E1E]">- {currency(discount)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#1E1E1E] font-semibold">Grand Total</span>
        <span className="text-lg font-medium text-[#1E1E1E]">
          {currency(grandTotal)}
        </span>
      </div>
    </div>
    <div className="">
      <h4 className="text-2xl font-semibold mb-2">Notes</h4>
      <p className="text-[#828282] font-medium text-lg">
        {notes || "No notes were written"}
      </p>
    </div>
  </aside>
);

export default function ViewDetailsModal({
  open,
  onClose,
  orderId,
  className,
}: Props) {
  const { data: orderData, isLoading, error } = useOrderById(orderId || "");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow || "";
      document.body.style.paddingRight = prevPaddingRight || "";
    };
  }, [open]);

  if (!open || !orderId) return null;

  if (isLoading) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-dialog-title"
        className={cn(
          "fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-8",
          className
        )}
      >
        <ModalOverlay onClose={onClose} />
        <div className="relative z-10 w-full p-[60px] bg-white xl:max-w-[1100px] 2xl:max-w-[1200px] overflow-hidden max-h-[90vh] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin size-[40px] text-[#00B5A5] mb-5" />
            <p className="text-lg">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }
  ;
  if (error || !orderData?.order) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-dialog-title"
        className={cn(
          "fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-8",
          className
        )}
      >
        <ModalOverlay onClose={onClose} />
        <div className="relative z-10 w-full p-[60px] xl:max-w-[1100px] 2xl:max-w-[1200px] bg-white overflow-hidden max-h-[90vh] flex items-center justify-center">
          <div className="text-red-500">Error loading order details</div>
        </div>
      </div>
    );
  }

  const order = orderData.order;
  const cart = order.cart;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const mapOrderStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Pending",
      shipped: "Shipped",
      delivered: "Completed",
      cancelled: "Canceled",
    };
    return statusMap[status] || "Pending";
  };

  const orderItem: OrderLine = {
    id: cart.id,
    name: cart.product.productName || "",
    price: Number(cart.product.price),
    qty: cart.quantity,
    image: cart.product.images?.[0] || "",
  };

  const subTotal = Number(cart.subTotal);
  const deliveryFee = Number(cart.deliveryFee);
  const discount = Number(cart.discount);
  const grandTotal = Number(cart.grandTotal);

  const addressText = `${order.address.fullAddress}, ${order.address.area}, ${order.address.district}, ${order.address.division} - ${order.address.zipCode}`;

  const details: OrderDetails = {
    id: order.id,
    date: formatDate(order.createdAt),
    status: mapOrderStatus(order.orderStatus),
    items: [orderItem],
    deliveryFee,
    discount,
    address: addressText,
    notes: order.notes,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-dialog-title"
      className={cn(
        "fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-8",
        className
      )}
    >
      <ModalOverlay onClose={onClose} />
      <div className="relative z-10 w-full p-[60px] xl:max-w-[1100px] 2xl:max-w-[1200px] bg-white overflow-hidden max-h-[90vh]">
        <ModalHeader
          id={details.id}
          date={details.date}
          status={details.status}
        />
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] h-full">
          <div className="py-6">
            <OrderItemsList items={details.items} />
            <AddressSection address={details.address} />
          </div>
          <SummarySection
            subTotal={subTotal}
            deliveryFee={details.deliveryFee}
            discount={details.discount}
            grandTotal={grandTotal}
            notes={details.notes}
          />
        </div>
      </div>
    </div>
  );
}
