import CardSlider from "@/components/home/CardSlider";
import React from "react";

const BestSeller = () => {
  return (
    <div  className="2xl:py-[100px] 2xl:px-[150px]">
      <h1 className="uppercase text-[40px] text-center">OUR BEST SELLERS</h1>
      <CardSlider />
    </div>
  );
};

export default BestSeller;
