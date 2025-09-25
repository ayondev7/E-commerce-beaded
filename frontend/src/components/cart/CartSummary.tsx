"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  subTotal: number
  deliveryFee?: number
  discount?: number
  className?: string
  onCheckout?: () => void
}

const currency = (n: number) => `৳ ${n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function CartSummary({
  subTotal,
  deliveryFee = 60,
  discount = 100,
  className,
  onCheckout,
}: Props) {
  const grandTotal = subTotal + deliveryFee - discount

  return (
    <aside className={cn("bg-zinc-900 text-white rounded-lg p-6 md:p-8", className)}>
      <h3 className="text-lg font-medium">Summary</h3>

      <dl className="mt-6 space-y-3 text-sm text-zinc-300">
        <div className="flex items-center justify-between">
          <dt className="uppercase tracking-wider">Sub-Total</dt>
          <dd className="tabular-nums">{currency(subTotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="uppercase tracking-wider">Delivery Fee</dt>
          <dd className="tabular-nums">{currency(deliveryFee)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="uppercase tracking-wider">Discount</dt>
          <dd className="tabular-nums">- {currency(discount)}</dd>
        </div>
      </dl>

      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="flex items-center justify-between">
          <span className="uppercase tracking-wider text-[13px] text-zinc-300">Grand Total</span>
          <span className="text-xl font-semibold tabular-nums">{currency(grandTotal)}</span>
        </div>

        <Button
          className="mt-6 w-full rounded-full bg-white text-black hover:bg-white/90"
          onClick={onCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
    </aside>
  )
}
