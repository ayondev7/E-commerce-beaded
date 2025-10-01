"use client";

import React from "react";
import ProductImageGallery from "@/components/singleProduct/ProductImageGallery";
import ProductInfo from "@/components/singleProduct/ProductInfo";
import ReusableButton2 from "@/components/generalComponents/ReusableButton2";
import { LuHeart } from "react-icons/lu";
import { useProduct } from "@/hooks/productHooks";
import { useAddToCart } from "@/hooks/cartHooks";
import { useAddToWishlist } from "@/hooks/wishlistHooks";
import LoaderComponent from "@/components/generalComponents/LoaderComponent";
import toast from "react-hot-toast";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const Page = ({ params }: ProductPageProps) => {
  const { slug } = React.use(params);
  const { data: productResponse, isLoading, error } = useProduct(slug);
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();

  const handleAddToCart = () => {
    if (!productResponse?.product) return;
    
    const product = productResponse.product;
    
    if (product.isInCart) {
      toast.error("Product is already in your cart!");
      return;
    }

    const cartPayload = {
      productId: product.id,
      quantity: 1,
      subTotal: product.offerPrice || product.price,
      deliveryFee: 0,
      discount: 0,
      grandTotal: product.offerPrice || product.price,
    };
    
    addToCartMutation.mutate(cartPayload, {
      onSuccess: () => {
        toast.success("Added to cart!");
      },
        onError: (error: unknown) => {
          console.log("Cart error:", error);

          type ApiError = {
            response?: { status?: number; data?: { message?: string } };
            request?: unknown;
            message?: string;
          };

          const err = error as ApiError;

          if (err.response) {
            const status = err.response.status;
            const message = err.response.data?.message;

            if (status === 401) {
              toast.error("Please sign in to add items to your cart");
            } else if (status === 400 && message === "Product already exists in cart") {
              toast.error("This product is already in your cart");
            } else if (status === 404) {
              toast.error("This product is no longer available");
            } else if (message && typeof message === 'string') {
              toast.error(message);
            } else {
              toast.error("Failed to add to cart. Please try again");
            }
          } else if (err.request) {
            toast.error("Network error. Please check your connection and try again");
          } else if (err.message) {
            toast.error(`Error: ${err.message}`);
          } else {
            toast.error("Failed to add to cart. Please try again");
          }
        }
    });
  };

  const handleAddToWishlist = () => {
    if (!productResponse?.product) return;
    
    const product = productResponse.product;
    
    if (product.isInWishlist) {
      toast.error("Product is already in your wishlist!");
      return;
    }

    const wishlistPayload = {
      productId: product.id,
    };
    
    addToWishlistMutation.mutate(wishlistPayload, {
      onSuccess: () => {
        toast.success("Added to wishlist!");
      },
        onError: (error: unknown) => {
          console.log("Wishlist error:", error);

          type ApiError = {
            response?: { status?: number; data?: { message?: string } };
            request?: unknown;
            message?: string;
          };

          const err = error as ApiError;

          if (err.response) {
            const status = err.response.status;
            const message = err.response.data?.message;

            if (status === 401) {
              toast.error("Please sign in to add items to your wishlist");
            } else if (status === 400 && message === "Product already exists in wishlist") {
              toast.error("This product is already in your wishlist");
            } else if (status === 404) {
              toast.error("This product is no longer available");
            } else if (message && typeof message === 'string') {
              toast.error(message);
            } else {
              toast.error("Failed to add to wishlist. Please try again");
            }
          } else if (err.request) {
            toast.error("Network error. Please check your connection and try again");
          } else if (err.message) {
            toast.error(`Error: ${err.message}`);
          } else {
            toast.error("Failed to add to wishlist. Please try again");
          }
        }
    });
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (error || !productResponse?.product) {
    return (
      <div className="px-[150px] pt-[48px] pb-[116px]">Product not found</div>
    );
  }

  const product = productResponse.product;

  return (
    <div className="2xl:px-[60px] xl:px-10 3xl:px-[150px] pt-[48px] pb-[116px]">
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
            <button 
              onClick={handleAddToWishlist}
              disabled={addToWishlistMutation.isPending || product.isInWishlist}
              className="flex items-center gap-x-2 uppercase hover:cursor-pointer disabled:opacity-50"
            >
              <LuHeart className={`size-[20px] ${product.isInWishlist ? 'text-[#00B5A5]' : 'text-[#9C9C9C]'}`} />
              <span className="text-sm leading-[22.5px] tracking-[3%]">
                {product.isInWishlist ? 'Added to Wishlist' : 'Add to wishlist'}
              </span>
            </button>
          </div>

          <div className="mt-[32px]">
            <ReusableButton2
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || product.isInCart}
              className={`border border-[#7D7D7D] hover:border-none ${product.isInCart ? "bg-[#00B5A5] border-none" : ""}`}
              bgClassName="bg-[#00B5A5]"
              textClassName={`group-hover:text-white ${product.isInCart ? "text-white" : ""}`}
            >
              {product.isInCart ? 'Added to Cart' : 'Add to Cart'}
            </ReusableButton2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
