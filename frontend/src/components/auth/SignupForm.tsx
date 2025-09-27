"use client";
import React from "react";
import InputField from "@/components/generalComponents/Form/InputField";
import PasswordField from "@/components/generalComponents/Form/PasswordField";
import FileDropField from "@/components/generalComponents/Form/FileDropField";
import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleButton";
import Divider from "@/components/auth/Divider";

const SignupForm: React.FC = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate register action
  };

  return (
    <div className="">
      <h1 className="text-center text-4xl tracking-wide mb-8">SIGN UP</h1>
      <p className="text-center text-sm text-[#7D7D7D] uppercase mb-4">
        Connect with
      </p>
      <div className="mb-6">
        <GoogleButton label="Sign up with Google" />
      </div>
      <Divider />
      <form onSubmit={onSubmit} className="grid mt-6 grid-cols-2 gap-x-10 gap-y-10">
        <InputField
          label="Name"
          placeholder="Please enter your Name"
          value={name}
          onChange={setName}
        />
        <InputField
          label="Email"
          placeholder="Please enter your Email"
          value={email}
          onChange={setEmail}
        />
        <InputField
          label="Mobile"
          placeholder="Please enter your Number"
          value={mobile}
          onChange={setMobile}
        />
        <PasswordField
          label="Password"
          placeholder="Please enter your Password"
          value={password}
          onChange={setPassword}
        />
        <PasswordField
          label="Confirm Password"
          placeholder="Please confirm your Password"
          value={confirm}
          onChange={setConfirm}
        />
        <FileDropField
          label="Profile Image"
          multiple={false}
          onFilesChange={setFiles}
        />
        <button
          type="submit"
          className="w-full mt-2 px-4 py-3 text-lg tracking-wider bg-teal-600 text-white rounded-full"
        >
          CREATE YOUR ACCOUNT
        </button>
      </form>
      <Divider showOr={false} />
      <p className="text-center text-[#7D7D7D]">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-teal-600 font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
