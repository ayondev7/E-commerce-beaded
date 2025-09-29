"use client";
import React from "react";
import CartTable, { CartItem } from "@/components/cart/CartTable";
import CartSummary from "@/components/cart/CartSummary";
import { withRouteProtection } from "@/components/auth/RouteProtector";

function CartPage() {
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
    {
      id: 4,
      name: "Daisy Charm Anklet",
      price: 450,
      qty: 2,
      image: "/home/categories/2.png",
    },
    {
      id: 5,
      name: "Pearl Stack Ring",
      price: 799,
      qty: 1,
      image: "/home/categories/3.png",
    },
    {
      id: 6,
      name: "Boho Bead Necklace",
      price: 1299,
      qty: 1,
      image: "/home/categories/4.png",
    },
    {
      id: 7,
      name: "Gold Plated Hoops",
      price: 699,
      qty: 1,
      image: "/home/categories/1.png",
    },
    {
      id: 8,
      name: "Minimal Bar Bracelet",
      price: 349,
      qty: 3,
      image: "/home/categories/2.png",
    },
    {
      id: 9,
      name: "Crystal Drop Earrings",
      price: 899,
      qty: 1,
      image: "/home/categories/3.png",
    },
    {
      id: 10,
      name: "Charm Initial Necklace",
      price: 1099,
      qty: 1,
      image: "/home/categories/4.png",
    },
    {
      id: 11,
      name: "Sunburst Pendant",
      price: 749,
      qty: 1,
      image: "/home/categories/1.png",
    },
    {
      id: 12,
      name: "Luna Opal Ring",
      price: 1199,
      qty: 1,
      image: "/home/categories/2.png",
    },
    {
      id: 13,
      name: "Beaded Anklet",
      price: 259,
      qty: 2,
      image: "/home/categories/3.png",
    },
    {
      id: 14,
      name: "Stackable Bands",
      price: 499,
      qty: 1,
      image: "/home/categories/4.png",
    },
    {
      id: 15,
      name: "Ribbon Choker",
      price: 399,
      qty: 1,
      image: "/home/categories/1.png",
    },
    {
      id: 16,
      name: "Vintage Locket",
      price: 1499,
      qty: 1,
      image: "/home/categories/2.png",
    },
    {
      id: 17,
      name: "Hamsa Bracelet",
      price: 549,
      qty: 2,
      image: "/home/categories/3.png",
    },
    {
      id: 18,
      name: "Ocean Breeze Earrings",
      price: 799,
      qty: 1,
      image: "/home/categories/4.png",
    },
    {
      id: 19,
      name: "Moonstone Ring",
      price: 999,
      qty: 1,
      image: "/home/categories/1.png",
    },
    {
      id: 20,
      name: "Personalized Nameplate",
      price: 1299,
      qty: 1,
      image: "/home/categories/2.png",
    },
  ]);

  const handleQtyChange = (id: CartItem["id"], qty: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)));
  };

  const handleRemove = (id: CartItem["id"]) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const subTotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);

  return (
    // Make the page take full viewport height so we can control scrolling inside
    <div className="h-[100vh] w-screen pl-20">
      <div className="flex justify-between h-full">
        {/* Left: scrollable list - occupy ~65% width and scroll vertically when content overflows */}
        <div className="w-[67%] h-full pt-[56px] pb-[200px]">
          <CartTable
            items={items}
            onQtyChange={handleQtyChange}
            onRemove={handleRemove}
            className="w-full"
          />
        </div>

        {/* Right: summary - keep visible by using sticky positioning */}
        <div className="w-[25%]">
          <div className="sticky">
            <CartSummary subTotal={subTotal} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouteProtection(CartPage);
