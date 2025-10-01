"use client";
import CardSlider from "@/components/home/CardSlider";
import React from "react";
import { useBestSellers } from "@/hooks/productHooks";

const BestSeller = () => {
  const { data: bestSellers, isLoading } = useBestSellers();
  const bs = bestSellers as unknown;

  const rawProducts = Array.isArray(bs)
    ? (bs as unknown[])
    : (typeof bs === 'object' && bs !== null && Array.isArray((bs as { products?: unknown }).products))
    ? (bs as { products?: unknown }).products as unknown[]
    : [];

  const products = (rawProducts as Array<Record<string, unknown>>)
    .map((p, idx) => {
      const categoryObj = p.category as Record<string, unknown> | undefined;
      const images = Array.isArray(p.images) ? (p.images as string[]) : [];
      return {
        id: (p.id as string) ?? idx,
        productSlug: (p.productSlug as string) ?? "",
        image: images.length ? images[0] : "/home/categories/1.png",
        category: (p.categoryName as string) ?? (categoryObj?.name as string) ?? "BRACELET",
        name: (p.productName as string) ?? "Product",
        price: Number((p.offerPrice as number) ?? (p.price as number) ?? 0),
        isInCart: (p.isInCart as boolean) ?? false,
        isInWishlist: (p.isInWishlist as boolean) ?? false,
      };
    });

  return (
    <div className="xl:py-[100px] xl:px-10 2xl:px-[60px] 3xl:px-[150px]">
      <h1 className="uppercase text-[40px] text-center">OUR BEST SELLERS</h1>
      <CardSlider products={products} isLoading={isLoading} />
    </div>
  );
};

export default BestSeller;
