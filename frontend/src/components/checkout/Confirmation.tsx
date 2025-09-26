"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function Confirmation() {
  return (
    <section className="mx-auto max-w-3xl py-20 text-center">
      <div className="flex items-center justify-center">
        <div className="grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="size-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h1 className="mt-8 text-3xl font-semibold">Your order has been confirmed</h1>
      <p className="mt-2 text-zinc-500">Thank you for ordering from <span className="font-medium text-zinc-700">Beaded Bangladesh</span>.</p>
      <p className="mt-6 text-sm text-zinc-600">Order Code: <span className="font-semibold">#10102</span></p>
      <div className="mt-10">
        <Button className="rounded-full px-6 bg-emerald-500 hover:bg-emerald-600">View your order</Button>
      </div>
    </section>
  );
}
