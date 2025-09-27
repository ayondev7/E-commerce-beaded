"use client";
import React from "react";
import InputField from "@/components/profile/Form/InputField";
import PasswordField from "@/components/profile/Form/PasswordField";
import Link from "next/link";

const Divider = () => (
  <div className="flex items-center gap-4 my-6">
    <div className="h-px bg-[#D9D9D9] flex-1" />
    <span className="text-[#7D7D7D] text-sm uppercase tracking-wider">OR</span>
    <div className="h-px bg-[#D9D9D9] flex-1" />
  </div>
);

const GoogleButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full mt-4 px-4 py-3 text-xl leading-[30px] bg-white border border-[#7D7D7D] flex items-center justify-center"
  >
    <img src="/icons/settings.png" alt="G" className="h-5 w-5" />
  </button>
);

const SigninForm: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate login action
  };

  return (
    <div className="mx-auto w-full max-w-[520px] py-10">
      <h1 className="text-center text-4xl tracking-wide mb-8">SIGN IN</h1>
      <p className="text-center text-sm text-[#7D7D7D] uppercase mb-2">Connect with</p>
      <GoogleButton />
      <Divider />
      <form onSubmit={onSubmit} className="space-y-5">
        <InputField
          label="Email"
          placeholder="Enter Email"
          value={email}
          onChange={setEmail}
        />
        <PasswordField
          label="Password"
          placeholder="Enter Password"
          value={password}
          onChange={setPassword}
        />
        <button
          type="submit"
          className="w-full mt-2 px-4 py-3 text-lg tracking-wider bg-teal-600 text-white rounded-full"
        >
          SIGN IN
        </button>
      </form>
      <div className="text-center mt-4">
        <Link href="#" className="text-sm tracking-wider uppercase">
          Forgot password?
        </Link>
      </div>
      <Divider />
      <p className="text-center text-[#7D7D7D]">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-teal-600 font-semibold">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SigninForm;
