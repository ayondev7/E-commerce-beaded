"use client";
import React, { useEffect } from "react";
import { useStepper } from "./Stepper";
import ReusableButton2 from "../generalComponents/ReusableButton2";
import CartTableBody from "@/components/cart/CartTableBody";
import { useCartList } from "@/hooks/cartHooks";
import { useCreateOrder } from "@/hooks/orderHooks";
import { useOrderFormStore } from "@/store/orderFormStore";
import LoaderComponent from "@/components/generalComponents/LoaderComponent";
import { FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { 
  calculateCartTotals, 
  getCurrentQuantity, 
  getEffectivePrice 
} from "@/lib/utils";

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

export default function ReviewOrder() {
  const { back, next } = useStepper();
  const { data: cartData, isLoading, error } = useCartList();
  const createOrderMutation = useCreateOrder();
  const { orderData, setCartId, setOrderId } = useOrderFormStore();
  
  // Transform backend cart data to match CartTable component expectations
  const items: CartItem[] = React.useMemo(() => {
    if (!cartData?.cartItems) return [];
    
    return cartData.cartItems.map(item => {
      const regularPrice = Number(item.product.price);
      const offerPrice = item.product.offerPrice ? Number(item.product.offerPrice) : undefined;
      const effectivePrice = getEffectivePrice(regularPrice, offerPrice);
      
      return {
        id: item.id,
        name: item.product.productName || item.product.name || "Unknown Product",
        price: effectivePrice,
        qty: item.quantity,
        image: item.product.images?.[0] || "/home/categories/1.png",
      };
    });
  }, [cartData]);

  // Store cart ID in Zustand store when cart data is available
  useEffect(() => {
    if (cartData?.cartItems && cartData.cartItems.length > 0) {
      // For now, we'll use the first cart item's ID as the cart identifier
      // This might need adjustment based on your backend cart structure
      setCartId(cartData.cartItems[0].id);
    }
  }, [cartData, setCartId]);

  // Calculate cart totals using utility function
  const { subTotal, totalDiscount } = React.useMemo(() => {
    if (!cartData?.cartItems) return { subTotal: 0, totalDiscount: 0 };
    
    return calculateCartTotals(cartData.cartItems, []); // No pending changes in review mode
  }, [cartData]);

  const deliveryFee = 60;
  const grandTotal = subTotal + deliveryFee - totalDiscount;

  const handleConfirmOrder = async () => {
    if (!orderData.cartId) {
      toast.error("Cart ID is missing. Please try again.");
      return;
    }
    
    if (!orderData.deliveryInfo.selectedAddressId) {
      toast.error("Please select a delivery address.");
      return;
    }

    try {
      const result = await createOrderMutation.mutateAsync({
        cartId: orderData.cartId,
        addressId: orderData.deliveryInfo.selectedAddressId,
        notes: orderData.deliveryInfo.notes,
      });
      
      // Store the created order ID
      if (result?.order?.id) {
        setOrderId(result.order.id);
      }
      
      toast.success("Order created successfully!");
      next(); // Move to confirmation step
    } catch (error: unknown) {
      console.error("Create order error:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to create order. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return <LoaderComponent />;
  }

  // Error state
  if (error) {
    return (
      <section className="px-[150px] gap-y-12 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <p className="text-lg text-red-500 mb-4">Failed to load cart items</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#00B5A5] text-white rounded hover:bg-[#00A095] transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <section className="px-[150px] gap-y-12 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
          <button 
            onClick={() => window.location.href = '/all/all/shop'} 
            className="px-4 py-2 bg-[#00B5A5] text-white rounded hover:bg-[#00A095] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-[150px] gap-y-12 flex flex-col items-center">
      {/* Product Items (full width) */}
      <CartTableBody 
        className="w-[1000px]" 
        items={items} 
        reviewMode={true}
      />

      {/* Below the table: Delivery Address (left) and Order Summary (right) */}
      <div className="grid lg:grid-cols-2 w-[1000px] gap-10 items-start">
        {/* Delivery Address */}
        <div className="">
          <h3 className="text-[32px] tracking-[-2%]">Delivery Address</h3>
          <div className="text-lg leading-[26px]">
            <p>H-54, R-8, Niketan, Gulshan,</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="">
          <div className="space-y-6">
            {/* Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-base leading-[24px] font-semibold tracking-[-1%] text-[#7D7D7D] uppercase">
                  Sub-Total
                </span>
                <span className="text-base font-medium">
                  TK. {subTotal.toFixed(2)}
                </span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-base leading-[24px] font-semibold tracking-[-1%] text-[#7D7D7D] uppercase">
                    Discount
                  </span>
                  <span className="text-base font-medium">
                    -TK. {totalDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-base leading-[24px] font-semibold tracking-[-1%] text-[#7D7D7D] uppercase">
                  Delivery Fee
                </span>
                <span className="text-base font-medium">
                  TK. {deliveryFee.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-base leading-[24px] font-semibold tracking-[-1%] text-[#1E1E1E] uppercase">
                  Grand Total
                </span>
                <span className="text-2xl">
                  TK. {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <ReusableButton2
                className="border border-black flex-1"
                onClick={back}
              >
                Back
              </ReusableButton2>
              <ReusableButton2
                className="bg-[#00b5a6] flex-1"
                textClassName="text-white"
                onClick={handleConfirmOrder}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin size-5" />
                  </div>
                ) : (
                  "Confirm Order"
                )}
              </ReusableButton2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
