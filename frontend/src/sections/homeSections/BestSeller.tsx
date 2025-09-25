"use client";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import ProductCard from "@/components/product/ProductCard";
import ReusableButton from "@/components/generalComponents/ReusableButton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BestSeller = () => {
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex: number, newIndex: number) => setCurrentSlide(newIndex),
  };

  return (
    <div className="2xl:py-[100px] 2xl:px-[150px]">
      <h1 className="uppercase text-[40px] text-center">OUR BEST SELLERS</h1>
      <div className="my-[56px]">
        <Slider ref={sliderRef} {...settings}>
          {products.map((product) => (
            <div key={product.id} className="px-2.5">
              <ProductCard
                image={product.image}
                category={product.category}
                name={product.name}
                price={product.price}
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className="w-full flex items-center justify-between 2xl:px-[18%]">
        <ReusableButton
          iconClassName="text-[#1E1E1E]"
          buttonClassName="border-[#1E1E1E]"
          direction="left"
          disabled={currentSlide === 0}
          onClick={() => sliderRef.current?.slickPrev()}
        />
        <div className="flex items-center gap-x-6">
          {Array.from({ length: products.length - 3 }, (_, i) => (
            <span
              key={i}
              className={`h-[7px] w-[75px] rounded-[5px] cursor-pointer ${i === currentSlide ? 'bg-[#00B5A5]' : 'bg-[#F2F2F2]'}`}
              onClick={() => sliderRef.current?.slickGoTo(i)}
            />
          ))}
        </div>
        <ReusableButton
          iconClassName="text-[#1E1E1E]"
          buttonClassName="border-[#1E1E1E]"
          direction="right"
          disabled={currentSlide === products.length - 4}
          onClick={() => sliderRef.current?.slickNext()}
        />
      </div>
    </div>
  );
};

export default BestSeller;
