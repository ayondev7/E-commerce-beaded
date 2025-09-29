import ProductShowcase from "@/components/shop/ProductShowcase";
import SideFilter from "@/components/shop/SideFilter";
import React from "react";


const page = () => {
  return (
    <div className="px-[150px] pt-[42px] pb-[100px]">
      <div className="flex gap-x-[57px]">
       <div className="pt-[150px] min-w-[355px]">
         <SideFilter />
       </div>
       <ProductShowcase />
      </div>
    </div>
  );
};

export default page;
