"use client"
import React from "react"
import { Minus, Plus, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"

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

const currency = (n: number) => `৳${n.toLocaleString("en-BD", { minimumFractionDigits: 0 })}`

export default function CartTable({
  items,
  className,
  title = "Your Cart",
  onClose,
  onQtyChange,
  onRemove,
}: Props) {
  return (
    <section className={cn("bg-white rounded-lg", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <button
          aria-label="Close cart"
          onClick={onClose}
          className="inline-flex size-6 items-center justify-center rounded-full hover:bg-zinc-100"
        >
          <X className="size-4" />
        </button>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <span className="text-sm text-zinc-500">{items.length} Items</span>
      </div>

      {/* Column headers */}
      <div className="hidden md:grid grid-cols-[1fr_140px_120px_32px] items-center px-6 py-3 text-[12px] uppercase tracking-wider text-zinc-500">
        <span>Item</span>
        <span className="text-center">Qty</span>
        <span className="text-right">Price</span>
        <span />
      </div>

      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="grid grid-cols-[1fr] md:grid-cols-[1fr_140px_120px_32px] items-center gap-4 px-6 py-4">
            {/* Item info */}
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="size-14 rounded object-cover ring-1 ring-zinc-200"
              />
              <div>
                <p className="text-sm font-medium leading-snug uppercase">
                  {item.name}
                </p>
              </div>
            </div>

            {/* Qty control */}
            <div className="md:justify-self-center">
              <div className="flex h-9 w-[120px] items-center justify-between rounded-full border border-zinc-300 px-3">
                <button
                  aria-label="Decrease quantity"
                  className="text-zinc-700 hover:text-black disabled:opacity-40"
                  onClick={() => onQtyChange?.(item.id, Math.max(1, item.qty - 1))}
                  disabled={item.qty <= 1}
                >
                  <Minus className="size-4" />
                </button>
                <span className="tabular-nums text-sm font-medium">
                  {String(item.qty).padStart(2, "0")}
                </span>
                <button
                  aria-label="Increase quantity"
                  className="text-zinc-700 hover:text-black"
                  onClick={() => onQtyChange?.(item.id, item.qty + 1)}
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="justify-self-end text-right font-semibold">
              {currency(item.price)}
            </div>

            {/* Remove */}
            <div className="hidden md:flex justify-end">
              <button
                aria-label="Remove item"
                onClick={() => onRemove?.(item.id)}
                className="text-rose-500 hover:text-rose-600"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
