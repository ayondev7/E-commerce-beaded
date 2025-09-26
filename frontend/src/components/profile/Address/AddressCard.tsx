"use client"
import React from "react"
import LabelValue from "./LabelValue"
import { Button } from "@/components/ui/button"
import type { AddressData } from "../AddressForm"

type Props = {
  data: AddressData
  isDefault?: boolean
  onEdit: () => void
  onDelete: () => void
  onSetDefault?: () => void
}

const AddressCard: React.FC<Props> = ({ data, isDefault, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className="">
      <div className="mb-2 flex items-center gap-2 uppercase text-xs text-[#6D6D6D]">
        <span className="font-medium">{data.type || "Address"}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <LabelValue label="Division" value={data.division} />
        <LabelValue label="District" value={data.district} />
        <LabelValue label="Area" value={data.area} />
        <LabelValue label="ZIP Code" value={data.zip} />
        <LabelValue label="Full Address" value={data.address} colSpan />
      </div>

      <div className="mt-4 flex items-center justify-between">
        {isDefault ? (
          <span className="text-xs font-medium text-orange-500 uppercase">Default Address</span>
        ) : (
          <button
            className="text-xs uppercase text-[#6D6D6D] hover:text-foreground"
            onClick={onSetDefault}
          >
            Set as Address
          </button>
        )}
       
      </div>
    </div>
  )
}

export default AddressCard
