"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { labelClass, baseInputClass } from "./InputField";

interface TextareaFieldProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  textareaClassName?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  className,
  textareaClassName,
}) => {
  return (
    <div className={cn(className)}>
      {label && <label className={labelClass}>{label}</label>}
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange((e.target as HTMLTextAreaElement).value)}
        className={cn(
          // reuse base input styles but keep padding slightly different for textarea
          baseInputClass.replace('px-4 py-3', 'p-3 text-sm'),
          textareaClassName
        )}
      />
    </div>
  );
};

export default TextareaField;
