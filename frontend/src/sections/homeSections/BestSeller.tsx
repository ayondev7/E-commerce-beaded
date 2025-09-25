"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "@/components/product/ProductCard";
import ReusableButton from "@/components/generalComponents/ReusableButton";

const BestSeller = () => {
  const products = [
    { id: 1, image: "/home/categories/1.png", category: "BRACELET", name: "Flower Child Barbie Bracelet", price: 599 },
    { id: 2, image: "/home/categories/1.png", category: "NECKLACE", name: "Silver Chain Necklace", price: 899 },
    { id: 3, image: "/home/categories/1.png", category: "EARRINGS", name: "Gold Hoop Earrings", price: 499 },
    { id: 4, image: "/home/categories/1.png", category: "BRACELET", name: "Beaded Wristband", price: 349 },
    { id: 5, image: "/home/categories/1.png", category: "NECKLACE", name: "Pearl Pendant Necklace", price: 1299 },
    { id: 6, image: "/home/categories/1.png", category: "EARRINGS", name: "Diamond Stud Earrings", price: 1999 },
    { id: 7, image: "/home/categories/1.png", category: "BRACELET", name: "Leather Cuff Bracelet", price: 699 },
    { id: 8, image: "/home/categories/1.png", category: "NECKLACE", name: "Crystal Choker", price: 799 },
    { id: 9, image: "/home/categories/1.png", category: "EARRINGS", name: "Turquoise Drop Earrings", price: 649 },
    { id: 10, image: "/home/categories/1.png", category: "BRACELET", name: "Charm Bracelet", price: 549 },
  ];

  const slidesPerPage = 4;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    slidesToScroll: slidesPerPage,
    duration: 40,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      const pageCount = Math.ceil(products.length / slidesPerPage);
      setTotalPages(pageCount);
      setCurrentPage(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", update);
    emblaApi.on("reInit", update);

    update();
  }, [emblaApi, products.length]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  return (
    <div className="2xl:py-[100px] 2xl:px-[150px]">
      <h1 className="uppercase text-[40px] text-center">OUR BEST SELLERS</h1>

      <div className="my-[56px] overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products.map((product) => (
            <div key={product.id} className="flex-[0_0_25%] px-2.5">
              <ProductCard
                image={product.image}
                category={product.category}
                name={product.name}
                price={product.price}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex items-center justify-between 2xl:px-[18%]">
        {/* Prev Button */}
        <ReusableButton
          iconClassName="text-[#1E1E1E]"
          buttonClassName="border-[#1E1E1E]"
          direction="left"
          disabled={currentPage === 0}
          onClick={scrollPrev}
        />

        {/* Pagination Dots */}
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

        {/* Next Button */}
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

export default BestSeller;
