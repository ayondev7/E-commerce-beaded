"use client";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type OrderLine = {
  id: string | number;
  name: string;
  price: number; // per item
  qty: number;
  image: string;
};

export type OrderDetails = {
  id: string;
  date: string;
  status: string;
  items: OrderLine[];
  deliveryFee: number;
  discount: number; // positive number means subtract
  address: string;
  notes?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  details: OrderDetails | null;
  className?: string;
};

const currency = (n: number) =>
  `৳ ${n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ViewDetailsModal({ open, onClose, details, className }: Props) {
  const overlayRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock page scroll while modal is open and restore on close
  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // Compensate for scrollbar width to avoid layout shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow || "";
      document.body.style.paddingRight = prevPaddingRight || "";
    };
  }, [open]);

  if (!open || !details) return null;

  const subTotal = details.items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const grandTotal = subTotal + details.deliveryFee - details.discount;

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
      {/* Glossy blurred overlay (handles outside clicks) */}
      <div
        ref={overlayRef}
        onMouseDown={() => onClose()}
        className="absolute inset-0 backdrop-blur-[10px] bg-[rgba(0,0,0,0.5)]"
      />

      {/* Panel */}
      <div className="relative z-10 w-full md:max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E6E6]">
          <div>
            <div className="text-sm font-semibold tracking-[-1%] text-[#9C9C9C] uppercase">Order ID: <span className="text-[#1E1E1E]">{details.id}</span></div>
            <div className="text-sm text-[#7D7D7D] mt-1">{details.date}</div>
          </div>
          <div>
            <span className="px-4 py-1.5 rounded bg-yellow-100 text-yellow-700 font-semibold uppercase text-xs">{details.status}</span>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px]">
          {/* Items list */}
          <div className="px-6 py-6">
            <ul className="divide-y divide-[#E6E6E6]">
              {details.items.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-4 py-5">
                  <div className="flex items-center gap-4">
                    <Image src={it.image} alt={it.name} width={80} height={80} className="w-20 h-20 object-cover" />
                    <div>
                      <div className="text-[#1E1E1E] font-medium leading-6">{it.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-[#1E1E1E]">{it.qty}x</div>
                    <div className="text-[#1E1E1E] font-medium">{currency(it.price)}</div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Address & Notes - mobile stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div>
                <h4 className="text-xl leading-7 font-semibold mb-3">Delivery Address</h4>
                <p className="text-[#545454] leading-7 whitespace-pre-line">{details.address}</p>
              </div>
              <div>
                <h4 className="text-xl leading-7 font-semibold mb-3">Notes</h4>
                <p className="text-[#9C9C9C] leading-7">{details.notes || "No notes were written"}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside className="border-t md:border-t-0 md:border-l border-[#E6E6E6] bg-[#FCFCFC] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[#7D7D7D] font-semibold">Sub-total</span>
              <span className="text-[#1E1E1E]">{currency(subTotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#7D7D7D] font-semibold">Delivery Fee</span>
              <span className="text-[#1E1E1E]">{currency(details.deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#7D7D7D] font-semibold">Discount</span>
              <span className="text-[#1E1E1E]">- {currency(details.discount)}</span>
            </div>
            <hr className="my-1 border-[#E6E6E6]" />
            <div className="flex items-center justify-between">
              <span className="text-[#1E1E1E] font-semibold">Grand Total</span>
              <span className="text-2xl font-semibold text-[#1E1E1E]">{currency(grandTotal)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}