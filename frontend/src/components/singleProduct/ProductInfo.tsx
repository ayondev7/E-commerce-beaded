import Image from "next/image";
import React from "react";

interface ProductInfoProps {
  category: string;
  title: string;
  price: number;
  description: string;
}

const ProductInfo = ({
  category,
  title,
  price,
  description,
}: ProductInfoProps) => {
  return (
    <div className="flex flex-col">
      {/* Category */}
      <div className="text-xl leading-[22.5px] text-[#7D7D7D] mb-[14px]">
        {category}
      </div>

      {/* Product Title */}
      <h1 className="text-2xl mb-2">{title}</h1>

      {/* Price */}
      <div className="text-[32px] text-[#00B5A5] mb-[14px] flex items-center justify-start gap-x-1">
        <span>
          <Image
            src="/icons/taka.png"
            alt="Taka Icon"
            width={100}
            height={100}
            className="inline-block object-contain h-[46px] w-[21px]"
          />
        </span>
        <span>{price}</span>
      </div>

      {/* Description */}
      <div className="border-t border-b border-[#D9D9D9] py-9 text-[#333333] text-base">
        {description.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <p className="mt-3">
          All product images remain the sole property of the brands and are not
          for re-use on other stores.
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;
