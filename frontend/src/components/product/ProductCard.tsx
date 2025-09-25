import React from "react";
import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";

interface ProductCardProps {
  image: string;
  category: string;
  name: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, category, name, price }) => {
  return (
    <div className="max-w-[390px]">
      <Image
        src={image}
        alt="product"
        width={500}
        height={500}
        className="object-cover 2xl:w-[390px] 2xl:h-[495px]"
      />
      <div className="flex flex-col mt-[18px] uppercase items-center">
        <h1 className="text-sm text-[#6D6D6D]">{category}</h1>
        <h2 className="mt-[12px] text-xl">{name}</h2>
        <div className="mt-1.5 text-2xl font-medium text-[#00B5A5] flex items-center justify-center">
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
