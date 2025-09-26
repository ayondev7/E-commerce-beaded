"use client";
import React from "react";
import type { ProfileData } from "./ProfileInfoView";
import { genders } from "@/constants/genders";
import InputField, { baseInputClass } from "./Form/InputField";
import SelectField from "./Form/SelectField";

interface ProfileInfoFormProps {
  initial: ProfileData;
  onCancel?: () => void;
  onSave: (data: ProfileData) => void;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  initial,
  onCancel,
  onSave,
}) => {
  const [form, setForm] = React.useState<ProfileData>(initial);

  // Shared input classes to keep date/select visually consistent with HTML inputs
  const sharedInputClass = baseInputClass;

  const update = (k: keyof ProfileData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const fields = [
    { label: "First Name", name: "firstName", type: "text", inputType: "html" },
    { label: "Last Name", name: "lastName", type: "text", inputType: "html" },
    { label: "Email", name: "email", type: "email", inputType: "html" },
    { label: "Phone No.", name: "phone", type: "text", inputType: "html" },
    { label: "Gender", name: "gender", inputType: "select", options: genders },
    { label: "Date of Birth", name: "dob", inputType: "date" },
  ] as const;

  return (
    <div className="bg-[#fafafa] pt-5 pb-10">
      <div className="px-8 border-b border-[#ebebeb] pb-5 flex w-full justify-between items-center">
        <h3 className="text-[30px] leading-[38px] tracking-[-2%]">
          Edit Profile Info
        </h3>
        <div className="flex gap-x-5">
          <button
            className="text-lg leading-[24px] tracking-[8%] uppercase hover:cursor-pointer"
            onClick={() => onSave(form)}
          >
            Save
          </button>
          <button
            className="text-lg leading-[24px] tracking-[8%] uppercase hover:cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="pt-6 px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {fields.map((f) => {
            if (f.inputType === "select" && f.options) {
              return (
                <SelectField
                  key={f.name}
                  label={f.label}
                  value={form[f.name] || ""}
                  onChange={(v) => update(f.name, v)}
                  options={f.options}
                  placeholder={"Select"}
                  className={""}
                  triggerClassName={sharedInputClass}
                />
              );
            }

            if (f.inputType === "date") {
              return (
                <InputField
                  key={f.name}
                  label={f.label}
                  type="date"
                  value={form[f.name] || ""}
                  onChange={(v) => update(f.name, v)}
                  placeholder={f.label}
                  inputClassName={sharedInputClass}
                />
              );
            }

            return (
              <InputField
                key={f.name}
                label={f.label}
                type={(f as any).type || "text"}
                value={form[f.name] || ""}
                onChange={(v) => update(f.name, v)}
                placeholder={"Enter " + f.label}
                inputClassName={sharedInputClass}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoForm;
