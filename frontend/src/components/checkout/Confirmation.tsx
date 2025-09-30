import React from "react";
import { useRouter } from "next/navigation";
import { GoCheckCircle } from "react-icons/go";
import ReusableButton2 from "../generalComponents/ReusableButton2";
import { useOrderFormStore } from "@/store/orderFormStore";

const Confirmation = () => {
  const router = useRouter();
  const { orderData, resetOrderForm } = useOrderFormStore();

  const handleViewOrder = () => {
    resetOrderForm(); // Clear the order form data
    router.push('/orders');
  };

  return (
    <div className="flex flex-col items-center w-full">
      <GoCheckCircle className="size-[91px] text-[#67C18C] mb-[34px]" />
      <h1 className="mb-4 text-[48px] leading-[42px] tracking-[-1%]">
        Your order has been confirmed
      </h1>
      <h2 className="mb-6 text-xl leading-[26px]">
        <span className="text-[#7D7D7D]">Thank you for ordering from </span>
        <span>Beaded Bangladesh.</span>
      </h2>
      <h3 className="text-xl leading-[24px] font-semibold mb-[66px]">
        <span className="tracking-[-1%] text-[#333333]">Order Code:</span>
        <span className="text-[#4F4F4F]"> #{orderData.orderId || '123456'}</span>
      </h3>
      <ReusableButton2 
        className="bg-[#00b5a6]" 
        textClassName="text-white"
        onClick={handleViewOrder}
      >
        VIEW YOUR Order
      </ReusableButton2>
    </div>
  );
};

export default Confirmation;
