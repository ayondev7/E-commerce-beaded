"use client"
import React from "react"

const AddCard: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <button
    onClick={onAdd}
    className="rounded-md border border-dashed p-4 text-center text-[#6D6D6D] hover:bg-gray-50"
  >
    <div className="text-3xl">+</div>
    <div className="mt-2 text-sm uppercase">Add New Address</div>
  </button>
)

export default AddCard
