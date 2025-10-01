"use client";
import CardSlider from "@/components/home/CardSlider";
import React from "react";
import { useExclusiveCollection } from "@/hooks/productHooks";

const ExclusiveCollection = () => {
  const { data: exclusiveData, isLoading } = useExclusiveCollection();
  const ed = exclusiveData as any;

  const products = (Array.isArray(ed) ? ed : Array.isArray(ed?.products) ? ed.products : [])
    .map((p: any, idx: number) => ({
      id: p.id ?? idx,
      productSlug: p.productSlug ?? "",
      image: Array.isArray(p.images) && p.images.length ? p.images[0] : "/home/categories/1.png",
      category: p.categoryName ?? p.category?.name ?? "BRACELET",
      name: p.productName ?? "Product",
      price: Number(p.offerPrice ?? p.price ?? 0),
      isInCart: p.isInCart ?? false,
      isInWishlist: p.isInWishlist ?? false,
    }));

  return (
    <div className="2xl:py-[100px] 2xl:px-[150px]">
      <h1 className="uppercase text-[40px] text-center">Exclusive Collections</h1>
      <CardSlider products={products} isLoading={isLoading} />
    </div>
  );
};

export default ExclusiveCollection;
