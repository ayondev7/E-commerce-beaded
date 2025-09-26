"use client"
import React from "react"
import { LuMinus, LuPlus, LuTrash2, LuX } from "react-icons/lu"
import { cn } from "@/lib/utils"
import Image from "next/image"

export type CartItem = {
  id: string | number
  name: string
  price: number
  image: string
  qty: number
}

type Props = {
  items: CartItem[]
  className?: string
  title?: string
  onClose?: () => void
  onQtyChange?: (id: CartItem["id"], qty: number) => void
  onRemove?: (id: CartItem["id"]) => void
}

const currency = (n: number) => `TK. ${n.toLocaleString("en-BD", { minimumFractionDigits: 0 })}`

export default function CartTable({
  items,
  className,
  title = "Your Cart",
  onClose,
  onQtyChange,
  onRemove,
}: Props) {
  return (
    <section className={cn("bg-white", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 py-5">
        <button
          aria-label="Close cart"
          onClick={onClose}
          className="inline-flex size-6 items-center justify-center rounded-full hover:bg-zinc-100"
        >
          <LuX className="size-4" />
        </button>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <span className="text-sm text-zinc-500">{items.length} Items</span>
      </div>

      {/* Column headers */}
      <div className="hidden 2xl:grid grid-cols-[2fr_1fr_0.65fr_0.2fr] items-center py-3 border-b border-[#D9D9D9] text-sm leading-[20px] font-semibold text-[#9C9C9C] uppercase">
        <span>Item</span>
        <span className="text-center pr-20">Qty</span>
        <span className="text-right pr-14">Price</span>
        <span />
      </div>

      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="grid grid-cols-[1fr] 2xl:grid-cols-[2fr_1fr_0.65fr_0.2fr] items-center gap-x-10 py-9">
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
                <p className="text-xl uppercase">
                  {item.name}
                </p>
              </div>
            </div>

            {/* Qty control */}
            <div className="md:justify-self-center">
              <div className="flex w-[185px] items-center justify-between rounded-full border border-zinc-300 p-4">
                <button
                  aria-label="Decrease quantity"
                  className="text-[#7D7D7D]"
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
                  className="text-[#7D7D7D]"
                  onClick={() => onQtyChange?.(item.id, item.qty + 1)}
                >
                  <LuPlus className="size-5" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-2xl font-medium text-right">
              {currency(item.price)}
            </div>

            {/* Remove */}
            <div className="hidden md:flex justify-end">
              <button
                aria-label="Remove item"
                onClick={() => onRemove?.(item.id)}
                className="text-[#E55151]"
              >
                <LuTrash2 className="text-[#E55151] size-6" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
