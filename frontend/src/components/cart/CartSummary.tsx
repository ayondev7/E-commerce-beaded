"use client";
import React from "react";
import { FiLoader } from "react-icons/fi";
import ReusableButton2 from "../generalComponents/ReusableButton2";

type Props = {
  subTotal: number;
  deliveryFee?: number;
  discount?: number;
  className?: string;
  onProceed?: () => void;
  isProceedLoading?: boolean;
  hasPendingChanges?: boolean;
};

const currency = (n: number) =>
  `TK. ${n.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CartSummary({
  subTotal,
  deliveryFee = 60,
  discount = 0,
  onProceed,
  isProceedLoading = false,
  hasPendingChanges = false,
}: Props) {
  const grandTotal = subTotal + deliveryFee - discount;

  return (
    <aside className="bg-[#1E1E1E] flex flex-col justify-between min-h-screen w-full pb-[50px] pt-20 px-8">
      <div>
        <h3 className="text-2xl leading-[32px] tracking-[-2%] text-white mb-10">
          Summary
        </h3>

        <div className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[#7D7D7D] font-semibold text-base leading-[24px] tracking-[-1%]">
              Sub-Total
            </div>
            <div className="text-white text-sm font-medium leading-[22.5px] tracking-[-1%]">
              {currency(subTotal)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[#7D7D7D] font-semibold text-base leading-[24px] tracking-[-1%]">
              Delivery Fee
            </div>
            <div className="text-white text-sm font-medium leading-[22.5px] tracking-[-1%]">
              {currency(deliveryFee)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[#7D7D7D] font-semibold text-base leading-[24px] tracking-[-1%]">
              Discount
            </div>
            <div className="text-white text-sm font-medium leading-[22.5px] tracking-[-1%]">
              - {currency(discount)}
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="flex items-center justify-between">
          <span className="text-base leading-[24px] font-semibold text-white tracking-[-1%]">
            Grand Total
          </span>
          <span className="text-2xl leading-[32px] tracking-[-2%] text-white">
            {currency(grandTotal)}
          </span>
        </div>

      <div className="mt-6">
          <ReusableButton2
          onClick={onProceed}
          disabled={isProceedLoading}
          className="border-white border hover:border-none w-full"
          bgClassName="bg-white"
          textClassName="text-white text-nowrap group-hover:text-[#1e1e1e] text-sm leading-[20px] tracking-[8%] font-semibold"
        >
          {isProceedLoading ? (
            <div className="flex items-center justify-center gap-2">
              <FiLoader className="animate-spin size-4 text-white" />
              <span>Processing...</span>
            </div>
          ) : (
            "Proceed to Checkout"
          )}
        </ReusableButton2>
      </div>
      </div>
    </aside>
  );
}
