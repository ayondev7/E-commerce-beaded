"use client";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { labelClass } from "./InputField";

interface SelectFieldProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
  triggerClassName,
}) => {
  return (
    <div className={cn(className)}>
      {label && <label className={labelClass}>{label}</label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn("w-full justify-between !h-[56px] !px-4 !py-3 shadow-none text-xl leading-[30px] rounded-none", triggerClassName)}>
          <SelectValue placeholder={placeholder || "Select"} />
        </SelectTrigger>
        <SelectContent className={cn("rounded-none shadow-none")}>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className={cn("!px-4 !py-3 text-xl leading-[30px]")}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
