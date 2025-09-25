"use client";
import React from "react";
import ProductCard from "@/components/product/ProductCard";
import ReusableButton from "@/components/generalComponents/ReusableButton";

const BestSeller = () => {
  return (
    <div className="2xl:py-[100px] 2xl:px-[150px]">
      <h1 className="uppercase text-[40px] text-center">OUR BEST SELLERS</h1>
      <div className="my-[56px] grid xl:grid-cols-3 2xl:grid-cols-4 gap-x-5">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
      <div className="w-full flex items-center justify-between 2xl:px-[18%]">
        <ReusableButton
          iconClassName="text-[#1E1E1E]"
          buttonClassName="border-[#1E1E1E]"
          direction="left"
          onClick={() => {}}
        />
        <div className="flex items-center gap-x-6">
          <span className="h-[7px] w-[75px] rounded-[5px] bg-[#00B5A5]"></span>
          <span className="h-[7px] w-[75px] rounded-[5px] bg-[#F2F2F2]"></span>
          <span className="h-[7px] w-[75px] rounded-[5px] bg-[#F2F2F2]"></span>
          <span className="h-[7px] w-[75px] rounded-[5px] bg-[#F2F2F2]"></span>
        </div>
        <ReusableButton
          iconClassName="text-[#1E1E1E]"
          buttonClassName="border-[#1E1E1E]"
          direction="right"
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default BestSeller;
