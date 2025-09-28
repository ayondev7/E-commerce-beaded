"use client";
import React, { useState } from "react";
import { useStepper } from "./Stepper";
import SelectField from "@/components/generalComponents/Form/SelectField";
import InputField, {
  baseInputClass,
} from "@/components/generalComponents/Form/InputField";
import AddressView from "./Address/AddressView";
import AddressForm, {
  AddressData as AddressDataForm,
} from "./Address/AddressForm";
import ReusableButton2 from "../generalComponents/ReusableButton2";

export default function DeliveryInfo() {
  const { next } = useStepper();
  const [notes, setNotes] = useState("");
  const [addressType, setAddressType] = useState("Home");
  const [editingAddress, setEditingAddress] = useState(false);
  const [address, setAddress] = useState<AddressDataForm>({
    division: "Dhaka",
    district: "Dhaka",
    zip: "1401",
    area: "Gulshan",
    fullAddress: "House-54, Road-8, Niketan, Gulshan Dhaka",
  });
  return (
    <section className="px-[150px] grid md:grid-cols-[2fr_3fr] gap-20">
      {/* Left: Personal & Payment */}
      <div className="space-y-10">
        <div>
          <h2 className="text-[32px] mb-[35px]">Personal Info</h2>
          <div className=" bg-[#fafafa] px-8 py-[75px] grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="uppercase text-base text-[#7D7D7D] mb-1">Name</div>
              <div className="text-lg">Jenny Wilson</div>
            </div>
            <div>
              <div className="uppercase text-base text-[#7D7D7D] mb-1">
                Phone No.
              </div>
              <div className="text-lg">01234567890</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[32px] mb-3">Payment Info</h2>
          <p className="text-base text-[#7D7D7D] leading-[26px]">
            Cash on Delivery is available right now
          </p>
        </div>

        <div>
          <h2 className="text-[32px] mb-2">Notes</h2>
          <InputField
            value={notes}
            onChange={setNotes}
            placeholder="Notes"
            inputClassName={baseInputClass}
            className="max-w-[400px]"
          />
        </div>
      </div>

      {/* Right: Address */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Delivery Address</h2>
        <div>
          <div className="mb-2 text-sm">Your Address</div>
          <div className="flex gap-3 items-center justify-between">
            <SelectField
              value={addressType}
              onChange={setAddressType}
              options={["Home", "Office"]}
              placeholder="Select"
              triggerClassName={baseInputClass}
              className="w-[300px]"
            />
            <ReusableButton2
              className="border border-[#7D7D7D] hover:border-none"
              bgClassName="bg-[#00B5A5]"
              textClassName="group-hover:text-white"
            >
              Add new Address
            </ReusableButton2>
          </div>
        </div>

        {editingAddress ? (
          <AddressForm
            initial={address}
            onCancel={() => setEditingAddress(false)}
            onSave={(a) => {
              setAddress(a);
              setEditingAddress(false);
            }}
          />
        ) : (
          <AddressView data={address} onEdit={() => setEditingAddress(true)} />
        )}
        <div className="flex justify-end gap-4 pt-2">
          <ReusableButton2
            className="border border-black w-[251px]"
          >
            continue shopping
          </ReusableButton2>
          <ReusableButton2
            className=" bg-[#00b5a6] w-[251px]"
            textClassName="text-white"
            onClick={next}
          >
            Review Order
          </ReusableButton2>
        </div>
      </div>
    </section>
  );
}
