"use client";
import React from "react";
import InputField from "@/components/generalComponents/Form/InputField";
import PasswordField from "@/components/generalComponents/Form/PasswordField";
import FileDropField from "@/components/generalComponents/Form/FileDropField";
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
    <div className="mx-auto w-full max-w-[520px] py-10">
      <h1 className="text-center text-4xl tracking-wide mb-8">SIGN UP</h1>
      <p className="text-center text-sm text-[#7D7D7D] uppercase mb-2">Connect with</p>
      <GoogleButton />
      <Divider />
      <form onSubmit={onSubmit} className="space-y-5">
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
      <Divider />
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
