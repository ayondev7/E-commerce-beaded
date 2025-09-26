"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useStepper } from "./Stepper";

export default function DeliveryInfo() {
  const { next } = useStepper();
  return (
    <section className="mx-auto max-w-5xl grid md:grid-cols-2 gap-10 py-8">
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
          <input placeholder="Notes" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
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
            <select className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm">
              <option>Home</option>
              <option>Office</option>
            </select>
            <Button variant="outline" className="rounded-full px-5">Add new address</Button>
          </div>
        </div>

        <div className="rounded-md border border-zinc-200 p-6 text-sm">
          <div className="flex justify-end text-xs text-zinc-500 mb-4">Edit</div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="uppercase text-[11px] text-zinc-500">Division</div>
              <div className="mt-1 font-medium">Dhaka</div>
            </div>
            <div>
              <div className="uppercase text-[11px] text-zinc-500">District</div>
              <div className="mt-1 font-medium">Dhaka</div>
            </div>
            <div>
              <div className="uppercase text-[11px] text-zinc-500">Zip Code</div>
              <div className="mt-1 font-medium">1401</div>
            </div>
            <div>
              <div className="uppercase text-[11px] text-zinc-500">Area</div>
              <div className="mt-1 font-medium">Gulshan</div>
            </div>
            <div className="col-span-2">
              <div className="uppercase text-[11px] text-zinc-500">Full Address</div>
              <div className="mt-1 font-medium">House-54, Road-8, Niketan, Gulshan Dhaka</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
