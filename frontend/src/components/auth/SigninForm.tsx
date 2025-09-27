"use client";
import React from "react";
import InputField from "@/components/generalComponents/Form/InputField";
import PasswordField from "@/components/generalComponents/Form/PasswordField";
import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleButton";
import Divider from "@/components/auth/Divider";

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
      <p className="text-center text-sm text-[#7D7D7D] uppercase mb-2">Connect with</p>
      <GoogleButton label="Sign in with Google" />
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
      <Divider showOr={false} />
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
