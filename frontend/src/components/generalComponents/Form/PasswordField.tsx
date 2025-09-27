"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { baseInputClass, labelClass } from "./InputField";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
}) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className={cn(className)}>
      {label && <label className={labelClass}>{label}</label>}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
          placeholder={placeholder}
          className={cn(baseInputClass, "pr-11", inputClassName)}
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
        >
          {show ? (
            <AiOutlineEyeInvisible size={20} className="text-[#7D7D7D]" />
          ) : (
            <AiOutlineEye size={20} className="text-[#7D7D7D]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
