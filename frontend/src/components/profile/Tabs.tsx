"use client"
import React from "react"
import { cn } from "@/lib/utils"

type TabKey = "profile" | "addresses" | "orders" | "wishlist"

export interface TabsProps {
  value: TabKey
  onChange: (key: TabKey) => void
}

const tabs: { key: TabKey; label: string }[] = [
  { key: "profile", label: "Profile Info" },
  { key: "addresses", label: "My Addresses" },
  { key: "orders", label: "My Orders" },
  { key: "wishlist", label: "My Wishlist" },
]

export const Tabs: React.FC<TabsProps> = ({ value, onChange }) => {
  return (
    <div className="w-full flex justify-center">
      <nav className="border-b border-[#B7B7B7] w-[1000px] flex items-center justify-between">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={cn(
              "relative text-xl font-semibold hover:cursor-pointer uppercase py-4 !text-[#7D7D7D]", 
              value === t.key && "!text-[#00B5A5]"
            )}
            onClick={() => onChange(t.key)}
          >
            {t.label}
            <span
              className={cn(
                "absolute -bottom-px left-0 h-[4px] w-full bg-[#00B5A5] transition-opacity",
                value === t.key ? "opacity-100" : "opacity-0"
              )}
            />
          </button>
        ))}
      </nav>
    </div>
  )
}

export type { TabKey }
