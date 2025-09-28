"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { baseInputClass, labelClass } from "./InputField";

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

// Simple HTML date input wrapped to match our shared InputField styles
const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
}) => {
  return (
    <div className={cn(className)}>
      {label && <label className={labelClass}>{label}</label>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(baseInputClass, inputClassName)}
      />
    </div>
  );
};

export default DatePicker;