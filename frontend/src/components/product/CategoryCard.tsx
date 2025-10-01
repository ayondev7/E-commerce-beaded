"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  image: string;
  title: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ image, title }) => {
  const router = useRouter();

  const handleNavigate = () => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    router.push(`/all/${slug}/shop`);
  };

  return (
    <div className="text-center relative group overflow-hidden">
      <Image
        src={image}
        alt={title}
        width={600}
        height={600}
        className="xl:h-[450px] xl:w-[285px] 2xl:h-[490px] 2xl:w-[336px] 3xl:h-[535px] 3xl:w-[390px] object-cover"
      />
      <div className="absolute xl:h-[450px] xl:w-[285px] 2xl:h-[490px] 2xl:w-[336px] 3xl:h-[535px] 3xl:w-[390px] w-full inset-0 bg-black/40">
        <h3 className="absolute group-hover:translate-y-[-100px] xl:bottom-[40px] 2xl:bottom-[50px] 3xl:bottom-[54px] left-1/2 transform -translate-x-1/2 text-2xl font-medium uppercase text-white transition-transform duration-400 ease-out">
          {title}
        </h3>
        <button
          className="absolute text-nowrap cursor-pointer xl:w-[220px] 2xl:w-[240px] xl:bottom-[50px] 2xl:bottom-[60px] 3xl:bottom-[75px] left-1/2 transform -translate-x-1/2 uppercase bg-white text-lg font-medium flex justify-center items-center py-[18px] transition-transform duration-500 ease-out delay-100 translate-y-[150px] group-hover:translate-y-0"
          onClick={handleNavigate}
        >
          Shop collection
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
