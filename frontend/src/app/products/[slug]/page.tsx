"use client";

import React from "react";
import ProductImageGallery from "@/components/singleProduct/ProductImageGallery";
import ProductInfo from "@/components/singleProduct/ProductInfo";
import ReusableButton2 from "@/components/generalComponents/ReusableButton2";
import { LuHeart } from "react-icons/lu";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

const ProductPage = ({ params }: ProductPageProps) => {
  // Mock data - replace with actual data fetching based on slug
  const productData = {
    id: params.slug,
    category: "Necklace",
    title: "LAVENDER AND PINK WOODEN BEAD NECKLACE",
    price: 490,
    description:
      "Luxury bead accessories, handcrafted with beads from around the world! Our selection of fine jewelry features timeless designs in a variety of styles, all created with the highest quality materials.\n\nAll product images remain the sole property of the brands and are not for re-use on other stores.",
    images: [
      "/home/categories/1.png", // Replace with actual image paths
      "/home/categories/2.png",
      "/home/categories/3.png",
    ],
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", productData.id);
    // Implement add to cart functionality
  };

  const handleWishlistToggle = (productId: string, isWishlisted: boolean) => {
    console.log("Wishlist toggled:", productId, isWishlisted);
    // Implement wishlist functionality
  };

  return (
    <div className="px-[150px] pt-[48px] pb-[116px]">
      <div className="flex gap-x-[55px]">
        {/* Product Images */}
        <div className="flex justify-center">
          <ProductImageGallery
            images={productData.images}
            productName={productData.title}
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-start max-w-[628px] pt-[50px]">
          <ProductInfo
            category={productData.category}
            title={productData.title}
            price={productData.price}
            description={productData.description}
            onAddToCart={handleAddToCart}
          />

          <div className="mt-[44px]">
            <button className="flex items-center gap-x-2 uppercase hover:cursor-pointer">
              <LuHeart className="size-[20px] text-[#9C9C9C]" />
              <span className="text-sm leading-[22.5px] tracking-[3%]">
                Add to wishlist
              </span>
            </button>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-[32px]">
            <ReusableButton2>Add to Cart</ReusableButton2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
