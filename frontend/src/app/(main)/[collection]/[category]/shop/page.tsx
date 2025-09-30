import ProductShowcase from "@/components/shop/ProductShowcase";
import SideFilter from "@/components/shop/SideFilter";
import React from "react";

interface PageProps {
  params: {
    collection: string;
    category: string;
  };
}

const page = ({ params }: PageProps) => {
  const { collection, category } = params;
  
  return (
    <div className="px-[150px] pt-[42px] pb-[100px]">
      <div className="flex gap-x-[57px]">
       <div className="pt-[150px] min-w-[355px]">
         <SideFilter 
           initialCollection={collection} 
           initialCategory={category}
         />
       </div>
       <ProductShowcase 
         initialCollection={collection} 
         initialCategory={category} 
       />
      </div>
    </div>
  );
};

export default page;
