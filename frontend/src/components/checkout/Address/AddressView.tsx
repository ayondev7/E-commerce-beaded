"use client";
import React from "react";
import { FiEdit } from "react-icons/fi";

export interface AddressData {
  division: string;
  district: string;
  zip: string;
  area: string;
  fullAddress: string;
}

interface AddressViewProps {
  data: AddressData;
  onEdit: () => void;
}

const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-y-1">
    <span className="text-[#6D6D6D] text-lg leading-[24px] font-semibold">{label}</span>
    <span className="text-xl leading-[30px]">{value || "-"}</span>
  </div>
);

const AddressView: React.FC<AddressViewProps> = ({ data, onEdit }) => {
  return (
    <div className="bg-[#fafafa] pt-5 pb-6 px-6 rounded-sm border border-[#f1f1f1]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[22px] leading-[28px]">Delivery Address</h3>
        <button className="flex gap-x-2 items-center hover:cursor-pointer" onClick={onEdit}>
          <span className="text-sm leading-[20px] tracking-[8%] uppercase">Edit</span>
          <FiEdit className="size-[16px]" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-x-[21px] gap-y-6">
        <InfoRow label="Division" value={data.division} />
        <InfoRow label="District" value={data.district} />
        <InfoRow label="Zip Code" value={data.zip} />
        <InfoRow label="Area" value={data.area} />
        <div className="col-span-2">
          <span className="text-[#6D6D6D] text-lg leading-[24px] font-semibold">Full Address</span>
          <div className="text-xl leading-[30px] mt-1">{data.fullAddress}</div>
        </div>
      </div>
    </div>
  );
};

export default AddressView;
