import React from "react";
import { FiLoader } from "react-icons/fi";

const LoaderComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <FiLoader className="animate-spin size-[40px] text-[#00B5A5] mb-5" />
        <p className="text-lg ">Loading...</p>
      </div>
    </div>
  );
};

export default LoaderComponent;
