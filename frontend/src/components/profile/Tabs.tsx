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
    <div className="border-b">
      <nav className="mx-auto flex max-w-5xl items-center gap-10 overflow-x-auto px-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={cn(
              "relative py-4 text-sm uppercase tracking-wide text-[#6D6D6D]", 
              value === t.key && "text-[#00B5A5]"
            )}
            onClick={() => onChange(t.key)}
          >
            {t.label}
            <span
              className={cn(
                "absolute -bottom-px left-0 h-[2px] w-full bg-[#00B5A5] transition-opacity",
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
