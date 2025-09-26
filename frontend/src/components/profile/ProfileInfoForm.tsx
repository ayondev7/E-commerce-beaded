"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { ProfileData } from "./ProfileInfoView";
import { genders } from "@/constants/genders";
import { cn } from "@/lib/utils";

interface ProfileInfoFormProps {
  initial: ProfileData;
  onCancel?: () => void;
  onSave: (data: ProfileData) => void;
}

// Reusable HTML Input Component
const HTMLInput: React.FC<{
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ type = "text", value, onChange, placeholder, className }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full mt-2 px-4 py-3 text-xl leading-[30px] bg-white border border-[#7D7D7D] focus:outline-none focus:border-[#7D7D7D]",
        className
      )}
    />
  );
};

interface FieldProps {
  label: string;
  name: keyof ProfileData;
  type?: string;
  inputType?: 'html' | 'select' | 'date';
  options?: readonly string[];
  placeholder?: string;
  className?: string;
}

const Field: React.FC<{
  field: FieldProps;
  value: string;
  onChange: (value: string) => void;
}> = ({ field, value, onChange }) => {
  // Handle Select inputs (gender)
  if (field.inputType === 'select' && field.options) {
    return (
      <div>
        <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">
          {field.label}
        </label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={cn("w-full justify-between text-xl leading-[30px]", field.className)}>
            <SelectValue placeholder={field.placeholder || "Select"} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Handle Date inputs
  if (field.inputType === 'date') {
    return (
      <div>
        <label className="text-[#1E1E1E] text-lg leading-[24px] font-semibold mb-2">
          {field.label}
        </label>
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
          className={cn(field.className)}
        />
      </div>
    );
  }

  // Handle HTML inputs (default)
  return (
    <div>
      <label className="text-[#1E1E1E] text-lg leading-[24px] font-semibold">
        {field.label}
      </label>
      <HTMLInput
        type={field.type || "text"}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder || `Enter ${field.label}`}
        className={field.className}
      />
    </div>
  );
};

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  initial,
  onCancel,
  onSave,
}) => {
  const [form, setForm] = React.useState<ProfileData>(initial);

  const update = (k: keyof ProfileData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const fields: FieldProps[] = [
    { label: "First Name", name: "firstName", inputType: 'html' },
    { label: "Last Name", name: "lastName", inputType: 'html' },
    { label: "Email", name: "email", type: "email", inputType: 'html' },
    { label: "Phone No.", name: "phone", inputType: 'html' },
    { label: "Gender", name: "gender", inputType: 'select', options: genders },
    { label: "Date of Birth", name: "dob", inputType: 'date' },
  ];

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
          {fields.map((f) => (
            <Field
              key={f.name}
              field={f}
              value={form[f.name] || ""}
              onChange={(v) => update(f.name, v)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoForm;
