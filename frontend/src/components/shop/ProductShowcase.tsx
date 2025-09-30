"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import ProductCard from "../product/ProductCard";
import CustomPagination from "../generalComponents/CustomPagination";

const ProductShowcase = () => {
  const products = Array.from({ length: 20 }, (_, i) => ({
    productId: `product-${i + 1}`,
    image: "/home/categories/1.png",
    category: "Beaded Jewelry",
    name: `Product ${i + 1}`,
    price: 100 + i * 10,
  }));

  return (
    <div>
      <h1 className="uppercase text-[48px]">Shop</h1>
      <div className="flex items-center justify-between mb-[30px]">
        <span className="text-[#6D6D6D] text-lg tracking-[-1%] uppercase">
          Showing 9 Items
        </span>
        <Select>
          <SelectTrigger className={cn("w-[253px] shadow-none rounded-none focus:ring-none py-6 px-4 text-base text-[#7D7D7D] [&>svg]:w-4.5 [&>svg]:h-4.5")}>
            <SelectValue className="!text-[#7D7D7D] placeholder:!text-[#7D7D7D]" placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="shadow-none rounded-none">
            <SelectItem className="text-base text-[#7D7D7D]" value="light">Light</SelectItem>
            <SelectItem className="text-base text-[#7D7D7D]" value="dark">Dark</SelectItem>
            <SelectItem className="text-base text-[#7D7D7D]" value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-3 gap-x-5 gap-y-20">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
     <div className="mt-[30px]">
       <CustomPagination />
     </div>
    </div>
  );
};

export default ProductShowcase;
