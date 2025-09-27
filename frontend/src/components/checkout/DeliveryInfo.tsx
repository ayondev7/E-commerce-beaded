"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStepper } from "./Stepper";
import InputField from "@/components/profile/Form/InputField";
import SelectField from "@/components/profile/Form/SelectField";
import TextareaField from "@/components/profile/Form/TextareaField";
import AddressView, { AddressData as AddressDataView } from "./Address/AddressView";
import AddressForm, { AddressData as AddressDataForm } from "./Address/AddressForm";

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
    <section className="px-[150px] grid md:grid-cols-2 gap-10 py-8">
      {/* Left: Personal & Payment */}
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-5">Personal Info</h2>
          <div className="rounded-md bg-zinc-100 p-6 grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="uppercase text-[11px] text-zinc-500">Name</div>
              <div className="mt-1 font-medium">Jenny Wilson</div>
            </div>
            <div>
              <div className="uppercase text-[11px] text-zinc-500">Phone No.</div>
              <div className="mt-1 font-medium">01234567890</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Payment Info</h2>
          <p className="text-sm text-zinc-500">Cash on Delivery is available right now</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Notes</h2>
          <TextareaField
            value={notes}
            onChange={setNotes}
            placeholder="Notes"
            textareaClassName="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <Button variant="outline" className="rounded-full px-6">Continue Shopping</Button>
          <Button className="rounded-full px-6 bg-emerald-500 hover:bg-emerald-600" onClick={next}>Review Order</Button>
        </div>
      </div>

      {/* Right: Address */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Delivery Address</h2>
        <div>
          <div className="mb-2 text-sm">Your Address</div>
          <div className="flex gap-3">
            <div className="flex-1">
              <SelectField
                value={addressType}
                onChange={setAddressType}
                options={["Home", "Office"]}
                placeholder="Select"
              />
            </div>
            <Button variant="outline" className="rounded-full px-5">Add new address</Button>
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
      </div>
    </section>
  );
}
