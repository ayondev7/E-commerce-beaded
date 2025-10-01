"use client";
import React from "react";
import { divisions, districtsByDivision, areasByDistrict } from "@/constants/addressConstants";
import { FiLoader } from "react-icons/fi";
import InputField, { baseInputClass } from "@/components/generalComponents/Form/InputField";
import SelectField from "@/components/generalComponents/Form/SelectField";
import TextareaField from "@/components/generalComponents/Form/TextareaField";

export interface AddressData {
  division: string;
  district: string;
  zip: string;
  area: string;
  fullAddress: string;
}

interface AddressFormProps {
  initial: AddressData;
  onCancel?: () => void;
  onSave: (data: AddressData) => void;
  isEditing?: boolean; // New prop to determine if we're editing or adding
  isLoading?: boolean; // New prop for loading state
}

const AddressForm: React.FC<AddressFormProps> = ({ initial, onCancel, onSave, isEditing = false, isLoading = false }) => {
  const [form, setForm] = React.useState<AddressData>(initial);

  const update = (k: keyof AddressData, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  // Helper handlers to clear dependent selects when parent changes
  const handleDivisionChange = (v: string) => {
    setForm((p) => ({ ...p, division: v, district: "", area: "" }));
  };

  const handleDistrictChange = (v: string) => {
    setForm((p) => ({ ...p, district: v, area: "" }));
  };

  return (
    <div className="bg-[#fafafa] pt-5 pb-6 px-6 rounded-sm border border-[#f1f1f1]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[22px] leading-[28px]">
          {isEditing ? "Edit Delivery Address" : "Add New Delivery Address"}
        </h3>
        <div className="flex gap-x-4">
          <button 
            type="button"
            className="text-sm uppercase flex items-center gap-1" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSave(form);
            }}
            disabled={isLoading}
          >
            {isLoading && <FiLoader className="animate-spin size-3" />}
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button 
            type="button"
            className="text-sm uppercase" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel?.();
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SelectField
          label="Division"
          value={form.division}
          onChange={handleDivisionChange}
          options={divisions as unknown as string[]}
          placeholder="Select Division"
          triggerClassName={baseInputClass}
        />
        <SelectField
          label="District"
          value={form.district}
          onChange={handleDistrictChange}
          options={districtsByDivision[form.division] ?? []}
          placeholder="Select District"
          triggerClassName={baseInputClass}
        />
        {/* Keeping Zip Code as a normal input in the grid */}
        <InputField
          label="Zip Code"
          value={form.zip}
          onChange={(v) => update("zip", v)}
          inputClassName={baseInputClass}
        />
        <SelectField
          label="Area"
          value={form.area}
          onChange={(v) => update("area", v)}
          options={areasByDistrict[form.district] ?? []}
          placeholder="Select Area"
          triggerClassName={baseInputClass}
        />
        <TextareaField
          label="Full Address"
          value={form.fullAddress}
          onChange={(v) => update("fullAddress", v)}
          placeholder="Enter full address"
          className={"col-span-1 md:col-span-2"}
        />
      </div>
    </div>
  );
};

export default AddressForm;
