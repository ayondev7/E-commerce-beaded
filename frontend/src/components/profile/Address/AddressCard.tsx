"use client";
import React from "react";
import LabelValue from "./LabelValue";
import { FiEdit, FiTrash, FiLoader } from "react-icons/fi";
import type { AddressData } from "../AddressForm";

type Props = {
  data: AddressData;
  isDefault?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault?: () => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
};

const AddressCard: React.FC<Props> = ({
  data,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting = false,
  isSettingDefault = false,
}) => {
  return (
    <div className="relative">
      <div className="bg-[#f8f8f8]">
        <div className="px-5 py-5 flex justify-between items-center border-b-[2px] border-[#ebebeb]">
          <span className="text-xl leading-[26px] ">
            {data.addressType || "Address"}
          </span>
          <div className="flex gap-x-2.5">
            <FiEdit
              className="inline size-[18px] hover:cursor-pointer"
              onClick={onEdit}
            />
            {isDeleting ? (
              <FiLoader className="inline size-[18px] animate-spin" />
            ) : (
              <FiTrash
                className="inline size-[18px] hover:cursor-pointer"
                onClick={onDelete}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-10 gap-x-[60px] p-5">
          <LabelValue label="Division" value={data.division} />
          <LabelValue label="District" value={data.district} />
          <LabelValue label="Area" value={data.area} />
          <LabelValue label="ZIP Code" value={data.zipCode} />
          <LabelValue label="Full Address" value={data.fullAddress} colSpan />
        </div>
      </div>
      <div className="absolute bottom-[-45px] left-1/2 -translate-x-1/2 text-lg leading-[24px] flex items-center justify-center">
        {isDefault ? (
          <span className=" font-medium text-[#EA9442] uppercase">
            Default Address
          </span>
        ) : (
          <button
            className="uppercase flex items-center gap-1"
            onClick={onSetDefault}
            disabled={isSettingDefault}
          >
            {isSettingDefault && <FiLoader className="animate-spin size-4" />}
            Set as Address
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
