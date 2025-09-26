"use client";
import React from "react";
import CartTable, { type CartItem } from "@/components/cart/CartTable";
import CartSummary from "@/components/cart/CartSummary";
import { useStepper } from "./Stepper";
import { Button } from "@/components/ui/button";

const items: CartItem[] = [
  { id: 1, name: "Flower child barbie bracelet", price: 599, qty: 1, image: "/home/categories/1.png" },
  { id: 2, name: "Flower child barbie bracelet", price: 599, qty: 1, image: "/home/categories/2.png" },
  { id: 3, name: "Flower child barbie bracelet", price: 599, qty: 1, image: "/home/categories/3.png" },
];

export default function ReviewOrder() {
  const { back, next } = useStepper();
  const subTotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <section className="mx-auto max-w-6xl py-8 grid lg:grid-cols-[1fr_380px] gap-10">
      <div>
        <CartTable
          items={items}
          title="Review Order"
          onQtyChange={() => {}}
          onRemove={() => {}}
        />
      </div>
    </section>
  );
}
