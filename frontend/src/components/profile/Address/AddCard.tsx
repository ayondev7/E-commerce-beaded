"use client"
import React from "react"
import { FiPlus } from "react-icons/fi";

const AddCard: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <button
    onClick={onAdd}
    className="border border-[#D9D9D9] hover:cursor-pointer flex flex-col items-center justify-center"
  >
    <div className="text-[32px] size-[52px] text-white rounded-full bg-[#9C9C9C] flex justify-center items-center"><FiPlus /> </div>
    <div className="mt-4 uppercase text-base leading-[20px] tracking-[8%] font-medium">Add New Address</div>
  </button>
)

export default AddCard
