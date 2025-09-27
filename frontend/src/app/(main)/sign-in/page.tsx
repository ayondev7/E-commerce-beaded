import React from "react";
import SigninForm from "@/components/auth/SigninForm";

const Page = () => {
  return (
    <main className="min-h-[calc(100vh-120px)] bg-[#F7F7F7] px-4">
      <div className="mx-auto max-w-4xl bg-white shadow-sm border border-[#EEE] px-6 md:px-16 py-10 my-10">
        <SigninForm />
      </div>
    </main>
  );
};

export default Page;