"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import ReusableButton from "@/components/generalComponents/ReusableButton";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const images = [
    "/home/heroSlider/1.jpg",
    "/home/heroSlider/2.jpg",
    "/home/heroSlider/3.jpg",
    "/home/heroSlider/4.jpg",
    "/home/heroSlider/5.jpg",
    "/home/heroSlider/6.png",
  ];

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div key={index} className="relative flex-[0_0_100%]">
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
        </div>
      </div>

      <div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center px-4">
        <h1 className="uppercase text-[64px] font-medium text-xl">
          Arts & Crafts Store
        </h1>
        <h2 className="mt-4 mb-[64px] max-w-[1000px]">
          Luxury bead accessories, handcrafted with beads from around the world!
          Our selection of fine jewelry features timeless designs in a variety
          of styles, all created with the highest quality materials.
        </h2>
        <button
          className="uppercase cursor-pointer text-[17px] font-medium px-[56px] py-[18px] border-2 border-white "
          onClick={() => router.push("/all/all/shop")}
        >
          SHOP NOW
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-between w-[calc(100vw-326px)]">
        <ReusableButton direction="left" onClick={scrollPrev} />
        <ReusableButton direction="right" onClick={scrollNext} />
      </div>
    </div>
  );
};

export default Hero;
