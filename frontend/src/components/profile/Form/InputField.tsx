"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  inputClassName?: string;
}

export const baseInputClass =
  "w-full mt-2 px-4 py-3 text-xl leading-[30px] bg-white border border-[#7D7D7D] focus:outline-none focus:border-[#7D7D7D]";

export const labelClass =
  "text-[#1E1E1E] text-lg leading-[24px] font-semibold mb-2";

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className,
  inputClassName,
}) => {
  return (
    <div className={cn(className)}>
      {label && <label className={labelClass}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        placeholder={placeholder}
        className={cn(baseInputClass, inputClassName)}
      />
    </div>
  );
};

export default InputField;
