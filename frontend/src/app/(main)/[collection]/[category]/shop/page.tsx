import ProductShowcase from "@/components/shop/ProductShowcase";
import SideFilter from "@/components/shop/SideFilter";
import { slugToReadableName } from "@/utils/slugUtils";
import React from "react";

interface PageProps {
  params: {
    collection: string;
    category: string;
  };
}

const page = ({ params }: PageProps) => {
  const { collection, category } = params;

  const readableCollection = slugToReadableName(collection);
  const readableCategory = slugToReadableName(category);

  return (
    <div className="px-[150px] pt-[42px] pb-[100px]">
      <div className="flex gap-x-[57px]">
       <div className="pt-[150px] min-w-[355px]">
         <SideFilter 
           initialCollection={readableCollection} 
           initialCategory={readableCategory}
         />
       </div>
       <ProductShowcase 
         initialCollection={readableCollection} 
         initialCategory={readableCategory} 
       />
      </div>
    </div>
  );
};

export default page;
