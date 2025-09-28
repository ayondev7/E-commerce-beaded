"use client";
import React from "react";
import SelectField from "@/components/generalComponents/Form/SelectField";
import InputField, { baseInputClass } from "@/components/generalComponents/Form/InputField";
import TextareaField from "@/components/generalComponents/Form/TextareaField";
import {
  divisions,
  districtsByDivision,
  areasByDistrict,
  precedenceOptions,
} from "@/constants/addressConstants";
import ReusableButton2 from "@/components/generalComponents/ReusableButton2";

export interface AddressData {
  id?: string;
  type: "Home" | "Work" | "Other" | "";
  name?: string;
  division: string;
  district: string;
  area: string;
  precedence?: "Default" | "Secondary" | "";
  address: string;
  zip: string;
}

interface AddressFormProps {
  title?: string;
  initial: AddressData;
}

const AddressForm: React.FC<AddressFormProps> = ({
  title = "Add New Address",
  initial,
}) => {
  const [form, setForm] = React.useState<AddressData>(initial);
  const update = (k: keyof AddressData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-[#fafafa] py-[70px] px-[80px]">
      <div className="mb-[54px] text-[36px] leading-[42px] text-center">
        {title}
      </div>
      <div className="">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SelectField
            label={"Select Address Type"}
            value={form.type}
            onChange={(v) => update("type", v)}
            options={["Home", "Work", "Other"]}
            placeholder={"Select"}
            triggerClassName={baseInputClass}
          />

          <InputField
            label={"Address Name (optional)"}
            value={form.name || ""}
            onChange={(v) => update("name", v)}
            placeholder={"Enter Address Name"}
            inputClassName={baseInputClass}
          />

          <SelectField
            label={"Select Division"}
            value={form.division}
            onChange={(v) => {
              update("division", v);
              // reset dependent selects
              update("district", "");
              update("area", "");
            }}
            options={divisions as unknown as string[]}
            placeholder={"Select"}
            triggerClassName={baseInputClass}
          />

          <SelectField
            label={"Select District"}
            value={form.district}
            onChange={(v) => {
              update("district", v);
              update("area", "");
            }}
            options={
              form.division ? districtsByDivision[form.division] || [] : []
            }
            placeholder={"Select"}
            triggerClassName={baseInputClass}
          />

          <SelectField
            label={"Select Area"}
            value={form.area}
            onChange={(v) => update("area", v)}
            options={form.district ? areasByDistrict[form.district] || [] : []}
            placeholder={"Select"}
            triggerClassName={baseInputClass}
          />

          <SelectField
            label={"Precedence"}
            value={form.precedence || ""}
            onChange={(v) => update("precedence", v)}
            options={precedenceOptions as unknown as string[]}
            placeholder={"Select"}
            triggerClassName={baseInputClass}
          />
          <TextareaField
            label={"Full Address"}
            value={form.address}
            onChange={(v) => update("address", v)}
            placeholder={"Please enter your full address"}
            rows={5}
            className={"md:col-span-2"}
            textareaClassName={""}
          />
          <InputField
            label={"ZIP Code"}
            value={form.zip}
            onChange={(v) => update("zip", v)}
            placeholder={"Enter ZIP"}
            inputClassName={baseInputClass}
          />
        </div>
        <div className="mt-[54px] flex justify-center gap-6">
          <ReusableButton2
            className="border border-[#7D7D7D] py-[15px] w-[290px]"
            textClassName="text-black"
          >
            Cancel
          </ReusableButton2>
          <ReusableButton2
            className="border bg-[#00b5a6] py-[15px] w-[290px]"
            bgClassName="bg-[#00B5A5]"
            textClassName="text-white"
          >
            Save Address
          </ReusableButton2>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
