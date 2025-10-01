"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CartTable, { CartItem } from "@/components/cart/CartTable";
import CartSummary from "@/components/cart/CartSummary";
import { withRouteProtection } from "@/components/auth/RouteProtector";
import { useCartList, useUpdateCartItem, useRemoveFromCart } from "@/hooks/cartHooks";
import LoaderComponent from "@/components/generalComponents/LoaderComponent";
import toast from "react-hot-toast";
import { 
  calculateCartTotals, 
  updatePendingChanges, 
  getCurrentQuantity, 
  getEffectivePrice
} from "@/lib/utils";
import { type QuantityChange } from "@/types";

function CartPage() {
  const router = useRouter();
  const { data: cartData, isLoading, error } = useCartList();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  
  // Local state for pending quantity changes
  const [pendingChanges, setPendingChanges] = useState<QuantityChange[]>([]);
  
  // Transform backend cart data to match CartTable component expectations
  const items: CartItem[] = React.useMemo(() => {
    if (!cartData?.cartItems) return [];
    
    return cartData.cartItems.map(item => {
      const quantity = getCurrentQuantity(item.id, item.quantity, pendingChanges);
      const regularPrice = Number(item.product.price);
      const offerPrice = item.product.offerPrice ? Number(item.product.offerPrice) : undefined;
      const effectivePrice = getEffectivePrice(regularPrice, offerPrice);
      
      return {
        id: item.id,
        name: item.product.productName || item.product.name || "Unknown Product",
        price: effectivePrice,
        qty: quantity,
        image: item.product.images?.[0] || "/home/categories/1.png",
      };
    });
  }, [cartData, pendingChanges]);

  const handleQtyChange = (id: CartItem["id"], qty: number) => {
    setPendingChanges(prev => updatePendingChanges(prev, String(id), qty));
  };

  const handleRemove = (id: CartItem["id"]) => {
    // Remove immediately from backend
    removeFromCartMutation.mutate(String(id), {
      onSuccess: () => {
        toast.success("Item removed from cart");
        // Also remove any pending changes for this item
        setPendingChanges(prev => prev.filter(change => change.cartItemId !== String(id)));
      },
      onError: (error: unknown) => {
        console.error("Remove cart item error:", error);
        toast.error("Failed to remove item from cart");
      }
    });
  };

  const handleProceed = async () => {
    if (pendingChanges.length === 0) {
      // No pending changes, proceed directly to checkout
      router.push('/checkout');
      return;
    }

    // Update all pending changes
    try {
      for (const change of pendingChanges) {
        await updateCartItemMutation.mutateAsync({
          id: change.cartItemId,
          payload: { quantity: change.newQuantity }
        });
      }
      
      // Clear pending changes and navigate to checkout
      setPendingChanges([]);
      router.push('/checkout');
      
    } catch (error) {
      console.error("Update cart error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Calculate cart totals using utility function
  const { subTotal, totalDiscount } = React.useMemo(() => {
    if (!cartData?.cartItems) return { subTotal: 0, totalDiscount: 0 };
    
    return calculateCartTotals(cartData.cartItems, pendingChanges);
  }, [cartData, pendingChanges]);

  // Loading state
  if (isLoading) {
    return <LoaderComponent />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="text-lg text-red-500 mb-4">Failed to load cart</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
          <button 
            onClick={() => window.location.href = '/all/all/shop'} 
            className="px-4 py-2 bg-[#00B5A5] text-white rounded hover:bg-[#00A095] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100vh] w-screen xl:pl-10 2xl:pl-20">
      <div className="flex justify-between h-full">
        <div className="xl:w-[72%] 2xl:w-[67%] h-full pt-[56px] pb-[200px]">
          <CartTable
            items={items}
            onQtyChange={handleQtyChange}
            onRemove={handleRemove}
            className="w-full"
          />
        </div>

        <div className="w-[25%]">
          <div className="sticky">
            <CartSummary 
              subTotal={subTotal}
              deliveryFee={60}
              discount={totalDiscount}
              onProceed={handleProceed}
              isProceedLoading={updateCartItemMutation.isPending}
              hasPendingChanges={pendingChanges.length > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouteProtection(CartPage);
