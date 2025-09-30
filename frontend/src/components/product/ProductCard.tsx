import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TbCurrencyTaka } from "react-icons/tb";
import { LuHeart, LuShoppingBag, LuHeartOff } from "react-icons/lu";
import { useAddToCart } from "@/hooks/cartHooks";
import { useAddToWishlist, useRemoveFromWishlist } from "@/hooks/wishlistHooks";
import toast from "react-hot-toast";

interface ProductCardProps {
  productId: string;
  image: string;
  category: string;
  name: string;
  price: number;
  isInCart?: boolean;
  isInWishlist?: boolean;
  showRemoveWishlist?: boolean;
  wishlistItemId?: string;
  imageClassName?: string;
  titleClassName?: string;
  categoryClassName?: string;
  priceClassName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  image,
  category,
  name,
  price,
  isInCart = false,
  isInWishlist = false,
  showRemoveWishlist = false,
  wishlistItemId,
  imageClassName,
  titleClassName,
  categoryClassName,
  priceClassName,
}) => {
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const handleAddToCart = () => {
    if (isInCart) {
      toast.error("Product is already in your cart!");
      return;
    }

    const cartPayload = {
      productId,
      quantity: 1,
      subTotal: price,
      deliveryFee: 0,
      discount: 0,
      grandTotal: price,
    };
    addToCartMutation.mutate(cartPayload, {
      onSuccess: () => {
        toast.success("Added to cart!");
      },
      onError: (error: any) => {
        console.log("Cart error:", error);
        
        if (error?.response) {
          const status = error.response.status;
          const message = error.response.data?.message;
          
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
        } else if (error?.request) {
          toast.error("Network error. Please check your connection and try again");
        } else if (error?.message) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("Failed to add to cart. Please try again");
        }
      }
    });
  };

  const handleAddToWishlist = () => {
    if (isInWishlist) {
      toast.error("Product is already in your wishlist!");
      return;
    }

    const wishlistPayload = {
      productId,
    };
    addToWishlistMutation.mutate(wishlistPayload, {
      onSuccess: () => {
        toast.success("Added to wishlist!");
      },
      onError: (error: any) => {
        console.log("Wishlist error:", error);
        
        if (error?.response) {
          const status = error.response.status;
          const message = error.response.data?.message;
          
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
        } else if (error?.request) {
          toast.error("Network error. Please check your connection and try again");
        } else if (error?.message) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("Failed to add to wishlist. Please try again");
        }
      }
    });
  };

  const handleRemoveFromWishlist = () => {
    if (!wishlistItemId) {
      toast.error("Unable to remove from wishlist");
      return;
    }

    removeFromWishlistMutation.mutate(wishlistItemId, {
      onSuccess: () => {
        toast.success("Removed from wishlist!");
      },
      onError: (error: any) => {
        console.log("Remove wishlist error:", error);
        
        if (error?.response) {
          const status = error.response.status;
          const message = error.response.data?.message;
          
          if (status === 401) {
            toast.error("Please sign in to manage your wishlist");
          } else if (status === 404) {
            toast.error("Item not found in wishlist");
          } else if (message && typeof message === 'string') {
            toast.error(message);
          } else {
            toast.error("Failed to remove from wishlist. Please try again");
          }
        } else if (error?.request) {
          toast.error("Network error. Please check your connection and try again");
        } else if (error?.message) {
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error("Failed to remove from wishlist. Please try again");
        }
      }
    });
  };
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
            {showRemoveWishlist ? (
              <button 
                onClick={handleRemoveFromWishlist}
                disabled={removeFromWishlistMutation.isPending}
                className="bg-[#00B5A5] p-3 rounded-full cursor-pointer disabled:opacity-50 transition-colors"
              >
                <LuHeartOff className="size-[24px] text-white" />
              </button>
            ) : (
              <button 
                onClick={handleAddToWishlist}
                disabled={addToWishlistMutation.isPending}
                className={`p-3 rounded-full cursor-pointer disabled:opacity-50 transition-colors ${
                  isInWishlist 
                    ? "bg-[#00B5A5] text-white" 
                    : "bg-white"
                }`}
              >
                <LuHeart className={`size-[24px] ${isInWishlist ? "text-white" : ""}`} />
              </button>
            )}
            <button 
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              className={`p-3 rounded-full cursor-pointer disabled:opacity-50 transition-colors ${
                isInCart 
                  ? "bg-[#00B5A5] text-white" 
                  : "bg-white"
              }`}
            >
              <LuShoppingBag className={`size-[24px] ${isInCart ? "text-white" : ""}`} />
            </button>
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
