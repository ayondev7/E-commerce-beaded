"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "@/components/product/ProductCard";
import ReusableButton from "@/components/generalComponents/ReusableButton";
import ProductCardSkeleton from "@/components/skeleton/ProductCardSkeleton";
import { useBestSellers } from "@/hooks/productHooks";
import { Product as ProductType } from "@/types";

const CardSlider: FC = () => {
  const { data: bestSellers, isLoading } = useBestSellers();
  const bs = bestSellers as any;

  const productsArray: ProductType[] = Array.isArray(bs)
    ? (bs as ProductType[])
    : Array.isArray(bs?.products)
    ? (bs.products as ProductType[])
    : [];

  const mappedProducts = productsArray.map((p: any, idx: number) => ({
    id: p.id ?? idx,
    productSlug: p.productSlug ?? ``,
    image:
      Array.isArray(p.images) && p.images.length
        ? p.images[0]
        : "/home/categories/1.png",
    category: p.categoryName ?? p.category?.name ?? "BRACELET",
    name: p.productName ?? "Product",
    price: Number(p.offerPrice ?? p.price ?? 0),
    isInCart: p.isInCart ?? false,
    isInWishlist: p.isInWishlist ?? false,
  }));

  const slidesPerPage = 4;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    slidesToScroll: slidesPerPage,
    duration: 40,
  });

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      const pageCount = Math.ceil(
        (isLoading ? slidesPerPage * 2 : mappedProducts.length) / slidesPerPage
      );
      setTotalPages(pageCount);
      setCurrentPage(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", update);
    emblaApi.on("reInit", update);

    update();

    return () => {
      if (!emblaApi) return;
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi, mappedProducts.length, isLoading]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <div>
      <div className="my-[56px] overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {isLoading
            ? Array.from({ length: slidesPerPage * 2 }).map((_, i) => (
                <div key={`skel-${i}`} className="flex-[0_0_25%] px-2.5">
                  <ProductCardSkeleton />
                </div>
              ))
            : mappedProducts.map((product) => (
                <div key={product.id} className="flex-[0_0_25%] px-2.5">
                  <ProductCard
                    productId={product.id}
                    image={product.image}
                    category={product.category}
                    name={product.name}
                    price={product.price}
                    isInCart={product.isInCart}
                    productSlug={product.productSlug}
                    isInWishlist={product.isInWishlist}
                  />
                </div>
              ))}
        </div>
      </div>

      <div className="w-full flex items-center justify-between 2xl:px-[18%]">
        <ReusableButton
          iconClassName="text-[#1E1E1E]"
          buttonClassName="border-[#1E1E1E]"
          direction="left"
          disabled={currentPage === 0}
          onClick={scrollPrev}
        />

        <div className="flex items-center gap-x-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i}
              className={`h-[7px] w-[75px] rounded-[5px] cursor-pointer ${
                i === currentPage ? "bg-[#00B5A5]" : "bg-[#F2F2F2]"
              }`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>

        <ReusableButton
          iconClassName="text-[#1E1E1E]"
          buttonClassName="border-[#1E1E1E]"
          direction="right"
          disabled={currentPage === totalPages - 1}
          onClick={scrollNext}
        />
      </div>
    </div>
  );
};

export default CardSlider;
