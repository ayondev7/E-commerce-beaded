"use client";
import React from "react";
import CategoryCard from "@/components/product/CategoryCard";
import { useCategoryList, Category } from "@/hooks/categoryHooks";
import ProductCardSkeleton from "@/components/skeleton/ProductCardSkeleton";

const Categories = () => {
  const { data: categoriesResponse, isLoading } = useCategoryList();

  const categoriesArray = categoriesResponse?.categories || [];
  
  const mappedCategories = categoriesArray?.map((category: Category) => ({
    id: category.id,
    image: category.image || "/home/categories/1.png",
    title: category.name,
  })) || [];

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
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={`category-skeleton-${i}`} />
            ))
          : mappedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                image={category.image}
                title={category.title}
              />
            ))}
      </div>
    </div>
  );
};

export default Categories;
