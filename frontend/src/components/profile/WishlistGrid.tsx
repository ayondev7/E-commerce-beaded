import React from "react"
import ProductCard from "@/components/product/ProductCard"
import ProductCardSkeleton from "@/components/skeleton/ProductCardSkeleton"
import { useWishlistList } from "@/hooks/wishlistHooks"

const WishlistGrid: React.FC = () => {
  const { data: wishlistData, isLoading, error } = useWishlistList();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-5 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg text-red-500">Error loading wishlist</div>
      </div>
    );
  }

  const wishlistItems = wishlistData?.wishlistItems || [];

  if (wishlistItems.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-lg text-gray-500">Your wishlist is empty</div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-x-5 gap-y-20 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden">
        {wishlistItems.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <ProductCard 
              productId={item.product.id}
              titleClassName="text-lg" 
              imageClassName="2xl:w-[320px] 2xl:h-[380px]" 
              image={item.product.images?.[0] || ""} 
              category={item.product.category.name} 
              name={item.product.productName || ""} 
              price={Number(item.product.price)}
              showRemoveWishlist={true}
              wishlistItemId={item.id}
              isInCart={item.product?.isInCart}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishlistGrid
