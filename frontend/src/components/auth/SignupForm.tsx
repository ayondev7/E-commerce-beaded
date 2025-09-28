"use client";
import React from "react";
import InputField from "@/components/generalComponents/Form/InputField";
import PasswordField from "@/components/generalComponents/Form/PasswordField";
import FileDropField from "@/components/generalComponents/Form/FileDropField";
import Link from "next/link";
import Divider from "@/components/auth/Divider";
import ReusableButton2 from "@/components/generalComponents/ReusableButton2";
import SelectField from "@/components/generalComponents/Form/SelectField";
import DatePicker from "@/components/generalComponents/Form/DatePicker";
import { genders } from "@/constants/genders";

const SignupForm: React.FC = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [dob, setDob] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate register action
  };

  return (
    <div className="">
      <h1 className="text-center text-4xl tracking-wide mb-8">SIGN UP</h1>
      <form
        onSubmit={onSubmit}
        className="grid mt-6 grid-cols-2 gap-x-10 gap-y-10"
      >
        <InputField
          label="Name"
          placeholder="Please enter your Name"
          value={name}
          onChange={setName}
          inputClassName="border-[#B7B7B7]"
        />
        <InputField
          label="Email"
          placeholder="Please enter your Email"
          value={email}
          onChange={setEmail}
          inputClassName="border-[#B7B7B7]"
        />
        <SelectField
          label="Gender"
          value={gender}
          onChange={setGender}
          options={genders}
          placeholder="Select Gender"
          triggerClassName="border-[#B7B7B7] bg-white"
        />
        <DatePicker
          label="Date of Birth"
          value={dob}
          onChange={setDob}
          placeholder="Select Date"
          inputClassName="border-[#B7B7B7]"
        />
        <InputField
          label="Mobile"
          placeholder="Please enter your Number"
          value={mobile}
          onChange={setMobile}
          inputClassName="border-[#B7B7B7]"
        />
        <PasswordField
          label="Password"
          placeholder="Please enter your Password"
          value={password}
          onChange={setPassword}
          inputClassName="border-[#B7B7B7]"
        />
        <PasswordField
          label="Confirm Password"
          placeholder="Please confirm your Password"
          value={confirm}
          onChange={setConfirm}
          inputClassName="border-[#B7B7B7]"
        />
        <FileDropField
          label="Profile Image"
          multiple={false}
          className="border-[#B7B7B7]"
        />
      </form>
      <div className="flex justify-center my-10">
        <ReusableButton2
          className="border border-[#B7B7B7] text-black hover:border-[#00b5a6] w-full"
          bgClassName="bg-[#00b5a6]"
          textClassName="group-hover:text-white"
        >
          Sign up
        </ReusableButton2>
      </div>
      <Divider showOr={false} />
      <p className="text-center text-[#7D7D7D]">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[#00b5a6] font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
