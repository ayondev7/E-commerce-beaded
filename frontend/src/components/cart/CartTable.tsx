"use client";
import React from "react";
import { LuArrowLeft } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import CartTableBody from "./CartTableBody";

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type Props = {
  items: CartItem[];
  className?: string;
  title?: string;
  onClose?: () => void;
  onQtyChange?: (id: CartItem["id"], qty: number) => void;
  onRemove?: (id: CartItem["id"]) => void;
};

export default function CartTable({
  items,
  className,
  title = "Your Cart",
  onClose,
  onQtyChange,
  onRemove,
}: Props) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };
  return (
    <section className={cn("bg-white", className)}>
      {/* Header */}
      <div className="py-4 flex gap-x-6 items-center">
        <button className="cursor-pointer" onClick={handleBackClick}>
          <LuArrowLeft className="size-5" />
        </button>
        <div className="flex gap-x-6 items-center">
          <h2 className="text-[36px] leading-[42px] tracking-[-1%]">{title}</h2>
          <span className="text-lg leading-[24px] font-medium tracking-[-1%] text-[#9C9C9C]">
            {items.length} Items
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="hidden 2xl:grid grid-cols-[2fr_1fr_0.65fr_0.2fr] items-center py-3 border-b border-[#D9D9D9] text-sm leading-[20px] font-semibold text-[#9C9C9C] uppercase">
        <span>Item</span>
        <span className="text-center pr-20">Qty</span>
        <span className="text-right pr-14">Price</span>
        <span />
      </div>

      {/* Body (extracted) */}
      <CartTableBody className="2xl:max-h-[75vh] 3xl:max-h-[80vh] overflow-x-hidden overflow-y-auto hide-scrollbar" items={items} onQtyChange={onQtyChange} onRemove={onRemove} />
    </section>
  );
}
