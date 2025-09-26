"use client"
import React from "react"
import CartTable, { CartItem } from "@/components/cart/CartTable"
import CartSummary from "@/components/cart/CartSummary"

export default function CartPage() {
  const [items, setItems] = React.useState<CartItem[]>([
    {
      id: 1,
      name: "Flower Child Barbie Bracelet",
      price: 1000,
      qty: 1,
      image: "/home/categories/1.png",
    },
    {
      id: 2,
      name: "Flower Child Barbie Bracelet",
      price: 599,
      qty: 1,
      image: "/home/categories/1.png",
    },
    {
      id: 3,
      name: "Flower Child Barbie Bracelet",
      price: 599,
      qty: 1,
      image: "/home/categories/1.png",
    },
  ])

  const handleQtyChange = (id: CartItem["id"], qty: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)))
  }

  const handleRemove = (id: CartItem["id"]) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const subTotal = items.reduce((acc, it) => acc + it.price * it.qty, 0)

  return (
      <div className="flex justify-between w-screen pl-20">
        <CartTable
          items={items}
          onQtyChange={handleQtyChange}
          onRemove={handleRemove}
          className="w-[65%]"
        />
        <div className="w-[25%]">
          <CartSummary subTotal={subTotal} />
        </div>
      </div>
  )
}