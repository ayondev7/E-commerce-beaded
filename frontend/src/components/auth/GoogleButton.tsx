"use client";
import React from "react";
import Image from "next/image";

type GoogleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

const GoogleButton: React.FC<GoogleButtonProps> = ({ label, className = "", ...props }) => {
  return (
    <button
      type="button"
      {...props}
      className={
        "w-full mt-4 px-4 py-3 text-xl leading-[30px] bg-white border border-[#7D7D7D] flex items-center justify-center " +
        className
      }
    >
      <Image src="/google.png" alt="Google" width={20} height={20} />
      {label ? <span className="sr-only">{label}</span> : null}
    </button>
  );
};

export default GoogleButton;
