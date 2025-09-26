"use client"
import React from "react"

const LabelValue: React.FC<{ label: string; value?: string; colSpan?: boolean }> = ({
  label,
  value,
  colSpan,
}) => (
  <div className={colSpan ? "col-span-2" : ""}>
    <div className="text-[#6D6D6D] text-lg leading-[24px] font-semibold uppercase mb-2">{label}</div>
    <div className="text-xl leading-[30px]">{value || "-"}</div>
  </div>
)

export default LabelValue
