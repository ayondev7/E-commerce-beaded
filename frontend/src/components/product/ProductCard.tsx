import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TbCurrencyTaka } from "react-icons/tb";
import { LuHeart, LuShoppingBag } from "react-icons/lu";

interface ProductCardProps {
  image: string;
  category: string;
  name: string;
  price: number;
  // optional class overrides for parts of the card. Provided classes will be merged
  // with defaults so you can override only specific utilities.
  imageClassName?: string;
  titleClassName?: string;
  categoryClassName?: string;
  priceClassName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  category,
  name,
  price,
  imageClassName,
  titleClassName,
  categoryClassName,
  priceClassName,
}) => {
  return (
    <div className="max-w-[390px]">
      <div className="relative overflow-hidden group">
        <Image
          src={image}
          alt="product"
          width={500}
          height={500}
          className={cn("object-cover 2xl:w-[390px] 2xl:h-[495px]", imageClassName)}
        />
        <div className="bg-white/35 absolute w-full bottom-0 h-[100px] transform translate-y-[120%] transition-transform duration-300 ease-out group-hover:translate-y-0">
          <div className="flex justify-center h-full items-center gap-x-3 text-[#7D7D7D]">
            <button className="bg-white p-3 rounded-full"><LuHeart className="size-[24px]" /></button>
            <button className="bg-white p-3 rounded-full"><LuShoppingBag className="size-[24px]" /></button>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-[18px] uppercase items-center">
        <h1 className={cn("text-sm text-[#6D6D6D]", categoryClassName)}>{category}</h1>
        <h2 className={cn("mt-[12px] text-xl", titleClassName)}>{name}</h2>
        <div className={cn("mt-1.5 text-2xl font-medium text-[#00B5A5] flex items-center justify-center", priceClassName)}>
          <span>
            <TbCurrencyTaka className="text-[26px]" />
          </span>
          <span>{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
