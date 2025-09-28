"use client";
import React from "react";
import InputField from "@/components/generalComponents/Form/InputField";
import PasswordField from "@/components/generalComponents/Form/PasswordField";
import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleButton";
import Divider from "@/components/auth/Divider";
import ReusableButton2 from "@/components/generalComponents/ReusableButton2";

const SigninForm: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate login action
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <h1 className="text-center text-4xl tracking-wide mb-8">SIGN IN</h1>
      <p className="text-center text-sm text-[#7D7D7D] uppercase mb-2">
        Connect with
      </p>
      <GoogleButton className="border-[#B7B7B7]" label="Sign in with Google" />
      <Divider />
      <form onSubmit={onSubmit} className="space-y-5">
        <InputField
          label="Email"
          placeholder="Enter Email"
          value={email}
          onChange={setEmail}
          inputClassName="border-[#B7B7B7]"
        />
        <PasswordField
          label="Password"
          placeholder="Enter Password"
          value={password}
          onChange={setPassword}
          inputClassName="border-[#B7B7B7]"
        />
        <div className="flex justify-center my-10">
          <ReusableButton2
            className="border border-[#B7B7B7] text-black hover:border-[#00b5a6] w-full"
            bgClassName="bg-[#00b5a6]"
            textClassName="group-hover:text-white"
          >
            Sign in
          </ReusableButton2>
        </div>
      </form>
      <div className="text-center mt-4">
        <Link href="#" className="text-sm tracking-wider uppercase">
          Forgot password?
        </Link>
      </div>
      <Divider showOr={false} />
      <p className="text-center text-[#7D7D7D]">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-[#00b5a6] font-semibold">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SigninForm;
