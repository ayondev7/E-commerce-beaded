"use client";
import React from "react";
import { cn } from "@/lib/utils";

export interface AuthDividerProps {
  showOr?: boolean;
  text?: string;
  className?: string;
  lineClassName?: string;
  textClassName?: string;
}

const AuthDivider: React.FC<AuthDividerProps> = ({
  showOr = true,
  text = "OR",
  className,
  lineClassName,
  textClassName,
}) => {
  return (
    <div className={cn("relative my-6", className)}>
      <div className={cn("h-px bg-[#D9D9D9] w-full", lineClassName)} />
      {showOr && (
        <span
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fafafa] px-3 text-[#7D7D7D] text-sm uppercase tracking-wider",
            textClassName
          )}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default AuthDivider;
