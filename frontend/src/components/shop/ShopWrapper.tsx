"use client";

import React from "react";
import ProductShowcase from "./ProductShowcase";
import SideFilter from "./SideFilter";

interface ShopWrapperProps {
  initialCollection: string;
  initialCategory: string;
}

const ShopWrapper = ({ initialCollection, initialCategory }: ShopWrapperProps) => {
  return (
    <div className="px-[150px] pt-[42px] pb-[100px]">
      <div className="flex gap-x-[57px]">
        <div className="pt-[150px] min-w-[355px]">
          <SideFilter 
            initialCollection={initialCollection} 
            initialCategory={initialCategory}
          />
        </div>
        <ProductShowcase 
          initialCollection={initialCollection} 
          initialCategory={initialCategory}
        />
      </div>
    </div>
  );
};

export default ShopWrapper;