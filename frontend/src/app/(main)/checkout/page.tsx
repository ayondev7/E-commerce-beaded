import React from "react";
import Stepper, { Step } from "@/components/checkout/Stepper";
import DeliveryInfo from "@/components/checkout/DeliveryInfo";
import ReviewOrder from "@/components/checkout/ReviewOrder";
import Confirmation from "@/components/checkout/Confirmation";

export default function CheckoutPage() {
  return (
    <main className="px-4 md:px-8 lg:px-12 py-20">
      <Stepper
        labels={["Delivery Info", "Review Order", "Confirmation"]}
        className=""
      >
        <Step>
          {/* <DeliveryInfo /> */}
           <ReviewOrder />
        </Step>
        <Step>
          <ReviewOrder />
        </Step>
        <Step>
          <Confirmation />
        </Step>
      </Stepper>
    </main>
  );
}
