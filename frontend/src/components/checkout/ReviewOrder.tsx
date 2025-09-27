"use client";
import React, { useState } from "react";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import { useStepper } from "./Stepper";
import Image from "next/image";
import ReusableButton2 from "../generalComponents/ReusableButton2";
import CartTableBody from "@/components/cart/CartTableBody";

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

const items: CartItem[] = [
  { id: 1, name: "Flower child barbie bracelet", price: 599, qty: 1, image: "/home/categories/1.png" },
  { id: 2, name: "Flower child barbie bracelet", price: 599, qty: 1, image: "/home/categories/2.png" },
  { id: 3, name: "Flower child barbie bracelet", price: 599, qty: 1, image: "/home/categories/3.png" },
];

const currency = (n: number) =>
  `৳${n.toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;

export default function ReviewOrder() {
  const { back, next } = useStepper();
  const [cartItems, setCartItems] = useState(items);
  
  const subTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = 60;
  const grandTotal = subTotal + deliveryFee;

  const handleQtyChange = (id: CartItem["id"], qty: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const handleRemove = (id: CartItem["id"]) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <section className="px-[150px] grid gap-12">
      {/* Product Items (full width) */}
      <CartTableBody items={cartItems} onQtyChange={handleQtyChange} onRemove={handleRemove} />

      {/* Below the table: Delivery Address (left) and Order Summary (right) */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
        {/* Delivery Address */}
        <div className="pt-2">
          <h3 className="text-2xl font-semibold mb-4">Delivery Address</h3>
          <div className="text-base text-gray-700">
            <p>H-54, R-8, Niketan, Gulshan,</p>
            <p>Dhaka</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded">
          <div className="space-y-6">
            {/* Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 uppercase">
                  Sub-Total
                </span>
                <span className="text-base font-medium">
                  ৳ {subTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 uppercase">
                  Delivery Fee
                </span>
                <span className="text-base font-medium">
                  ৳ {deliveryFee.toFixed(2)}
                </span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold uppercase">
                  Grand Total
                </span>
                <span className="text-xl font-bold">
                  ৳ {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <ReusableButton2
                className="border border-black flex-1"
                onClick={back}
              >
                Back
              </ReusableButton2>
              <ReusableButton2
                className="bg-[#00b5a6] flex-1"
                textClassName="text-white"
                onClick={next}
              >
                Confirm Order
              </ReusableButton2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
