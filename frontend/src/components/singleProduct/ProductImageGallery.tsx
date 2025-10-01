"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row gap-x-5">
      {/* Thumbnail Images */}
      <div className="flex lg:flex-col gap-y-5">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative cursor-pointer overflow-hidden border-2 transition-all duration-200",
              selectedImage === index 
                ? "border-[#00B5A5] opacity-100" 
                : "opacity-35 hover:opacity-60"
            )}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
             width={200}
             height={200}
              className="object-cover w-[180px] h-[190px]"
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative">
        <Image
          src={images[selectedImage]}
          alt={productName}
          
          className="object-cover xl:w-[500px] xl:h-[580px] 3xl:w-[600px] 2xl:w-[500px] 2xl:h-[600px] 3xl:h-[750px]"
          width={600}
          height={900}
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;