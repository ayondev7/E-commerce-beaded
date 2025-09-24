"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import "slick-carousel/slick/slick.css";
import ReusableButton from '@/components/generalComponents/ReusableButton';

const Hero = () => {
  const sliderRef = useRef<any>(null);

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const images = ["/home/heroSlider/1.png", "/home/heroSlider/2.jpg", "/home/heroSlider/3.jpg"];

  return (
    <div className="relative">
      <Slider ref={sliderRef} {...settings}>
        {images.map((src, index) => (
          <div key={index} className="relative">
            <Image
              src={src}
              alt={`Hero Image ${index + 1}`}
              className="w-screen h-[800px] object-cover"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 h-[800px] w-screen bg-black/45"></div>
          </div>
        ))}
      </Slider>
      <div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center px-4">
        <h1 className="uppercase text-[64px] font-medium text-xl">
          Arts & Crafts Store
        </h1>
        <h2 className="mt-4 mb-[64px] max-w-[1000px]">
          Luxury bead accessories, handcrafted with beads from around the world!
          Our selection of fine jewelry features timeless designs in a variety
          of styles, all created with the highest quality materials.
        </h2>
        <button className="uppercase text-[17px] font-medium px-[56px] py-[18px] border-2 border-white ">
          SHOP NOW
        </button>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-between w-[calc(100vw-326px)]">
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="w-[64px] h-[64px] flex items-center justify-center border-2 border-white rounded-full"
        >
          <LuChevronLeft className="text-white size-[30px]" />
        </button>
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="w-[64px] h-[64px] flex items-center justify-center border-2 border-white rounded-full"
        >
          <LuChevronRight className="text-white size-[30px]" />
        </button>
      </div>
    </div>
  );
};

export default Hero;
