"use client";

import React from "react";
import ProductImageGallery from "@/components/singleProduct/ProductImageGallery";
import ProductInfo from "@/components/singleProduct/ProductInfo";
import ReusableButton2 from "@/components/generalComponents/ReusableButton2";
import { LuHeart } from "react-icons/lu";
import { useProduct } from "@/hooks/productHooks";

interface ProductPageProps {
  params: Promise<{slug: string}>;
}

const Page = ({ params }: ProductPageProps) => {
  const { slug } = React.use(params);
  const { data: productResponse, isLoading, error } = useProduct(slug);
  
  if (isLoading) {
    return <div className="px-[150px] pt-[48px] pb-[116px]">Loading...</div>;
  }
  
  if (error || !productResponse?.product) {
    return <div className="px-[150px] pt-[48px] pb-[116px]">Product not found</div>;
  }
  
  const product = productResponse.product;

  return (
    <div className="px-[150px] pt-[48px] pb-[116px]">
      <div className="flex gap-x-[55px]">
        <div className="flex justify-center">
          <ProductImageGallery
            images={product.images}
            productName={product.productName}
          />
        </div>

        <div className="flex flex-col justify-start max-w-[628px] pt-[50px]">
          <ProductInfo
            category={product.categoryName || product.category?.name || ""}
            title={product.productName}
            price={product.offerPrice || product.price}
            description={product.productDescription}
          />

          <div className="mt-[44px]">
            <button className="flex items-center gap-x-2 uppercase hover:cursor-pointer">
              <LuHeart className="size-[20px] text-[#9C9C9C]" />
              <span className="text-sm leading-[22.5px] tracking-[3%]">
                Add to wishlist
              </span>
            </button>
          </div>

          <div className="mt-[32px]">
            <ReusableButton2
            className="border border-[#7D7D7D] hover:border-none"
            bgClassName="bg-[#00B5A5]"
            textClassName="group-hover:text-white"
            >Add to Cart
            </ReusableButton2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
