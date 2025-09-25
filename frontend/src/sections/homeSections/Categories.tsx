import React from "react";
import CategoryCard from "@/components/product/CategoryCard";

const Categories = () => {
  return (
    <div className="bg-[#FAFAFA] py-[100px] px-[150px]">
      <div className="flex flex-col items-center">
        <h1 className="uppercase text-[48px] mb-[15px] text-center">
          Our Top Categories
        </h1>
        <h2 className="mb-[55px] text-base text-center max-w-[632px]">
          Luxury bead accessories, handcrafted with beads from around the world!
          Our selection of fine jewelry features timeless designs in a variety
          of styles, all created with the highest quality materials.
        </h2>
      </div>
      <div className="grid 2xl:grid-cols-4 gap-x-[19px] justify-center">
        <CategoryCard image="/home/categories/1.png" title="Bracelets" />
        <CategoryCard image="/home/categories/2.png" title="Necklaces" />
        <CategoryCard image="/home/categories/3.png" title="Earrings" />
        <CategoryCard image="/home/categories/4.png" title="Rings" />
      </div>
    </div>
  );
};

export default Categories;
