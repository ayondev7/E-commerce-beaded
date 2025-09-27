import React from "react";
import SigninForm from "@/components/auth/SigninForm";

const Page = () => {
  return (
    <main className="py-[100px] flex justify-center">
      <div className="w-[800px] py-10 bg-[#fafafa]">
        <SigninForm />
      </div>
    </main>
  );
};

export default Page;