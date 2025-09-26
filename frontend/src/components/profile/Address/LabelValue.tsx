"use client"
import React from "react"

const LabelValue: React.FC<{ label: string; value?: string; colSpan?: boolean }> = ({
  label,
  value,
  colSpan,
}) => (
  <div className={colSpan ? "col-span-2" : ""}>
    <div className="text-[11px] uppercase text-[#6D6D6D]">{label}</div>
    <div>{value || "-"}</div>
  </div>
)

export default LabelValue
