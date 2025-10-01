"use client";
import React from "react";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import Image from "next/image";

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
  onQtyChange?: (id: CartItem["id"], qty: number) => void;
  onRemove?: (id: CartItem["id"]) => void;
  reviewMode?: boolean; // When true, hides quantity controls and remove buttons
};

const currency = (n: number) =>
  `TK. ${n.toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;

export default function CartTableBody({ items, className, onQtyChange, onRemove, reviewMode = false }: Props) {
  return (
    <div>
      <div className={`divide-y ${className || ''}`}>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-[1fr] xl:grid-cols-[2fr_1fr_0.65fr_0.2fr] items-center gap-x-10 py-9"
            >
              {/* Item info */}
              <div className="flex items-center gap-x-[30px]">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="object-cover w-[100px] h-[100px]"
                />
                <div>
                  <p className="text-xl uppercase">{item.name}</p>
                </div>
              </div>

              {/* Qty control or display */}
              <div className="md:justify-self-center">
                {reviewMode ? (
                  // Review mode: just show quantity as text
                  <div className="text-center">
                    <span className="text-lg font-medium">Qty: {String(item.qty).padStart(2, "0")}</span>
                  </div>
                ) : (
                  // Normal mode: quantity controls
                  <div className="flex w-[185px] items-center justify-between rounded-full border border-zinc-300 p-4">
                    <button
                      aria-label="Decrease quantity"
                      className="text-[#7D7D7D] cursor-pointer"
                      onClick={() => onQtyChange?.(item.id, Math.max(1, item.qty - 1))}
                      disabled={item.qty <= 1}
                    >
                      <LuMinus className="size-5" />
                    </button>
                    <span className="text-sm leading-[24px] font-medium tracking-[-1%]">
                      {String(item.qty).padStart(2, "0")}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      className="text-[#7D7D7D] cursor-pointer"
                      onClick={() => onQtyChange?.(item.id, item.qty + 1)}
                    >
                      <LuPlus className="size-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="text-2xl font-medium text-right">
                {currency(item.price)}
              </div>

              {/* Remove button (hidden in review mode) */}
              {!reviewMode && (
                <div className="hidden md:flex justify-end">
                  <button
                    aria-label="Remove item"
                    onClick={() => onRemove?.(item.id)}
                    className="text-[#E55151] cursor-pointer"
                  >
                    <LuTrash2 className="text-[#E55151] size-6" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
