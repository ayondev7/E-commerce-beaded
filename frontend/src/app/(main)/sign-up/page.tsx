import React from "react";
import SignupForm from "@/components/auth/SignupForm";

const Page = () => {
  return (
    <main className="py-[100px] flex justify-center">
      <div className="py-10 px-[140px] w-[1000px] bg-[#fafafa]">
        <SignupForm />
      </div>
    </main>
  );
};

export default Page;