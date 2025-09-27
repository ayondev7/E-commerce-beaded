"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { baseInputClass, labelClass } from "./InputField";

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

const EyeIcon: React.FC<{ open?: boolean } & React.ComponentProps<"svg">> = ({ open, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    {...props}
  >
    {open ? (
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="#7D7D7D" strokeWidth="1.5" />
    ) : (
      <>
        <path d="M3 3l18 18" stroke="#7D7D7D" strokeWidth="1.5" />
        <path d="M2 12s3.5-7 10-7c2.06 0 3.87.57 5.4 1.48" stroke="#7D7D7D" strokeWidth="1.5" />
        <path d="M22 12s-3.5 7-10 7a11.7 11.7 0 0 1-5.4-1.48" stroke="#7D7D7D" strokeWidth="1.5" />
      </>
    )}
    <circle cx="12" cy="12" r="3.5" stroke="#7D7D7D" strokeWidth="1.5" />
  </svg>
);

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
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
