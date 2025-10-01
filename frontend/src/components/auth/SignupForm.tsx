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
import { signIn, getSession } from "next-auth/react";
import { AUTH_ROUTES } from "@/routes/authRoutes";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";

const SignupForm: React.FC = () => {
  const [submitting, setSubmitting] = React.useState(false);
  const router = useRouter();

  const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirm: "",
      gender: "",
      dateOfBirth: "",
      imageFile: null as File | null,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.name?.trim()) errors.name = "Name is required";
      if (!values.email?.trim()) {
        errors.email = "Email is required";
      } else {
        // simple email regex
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(values.email.trim())) errors.email = "Invalid email";
      }
      if (!values.phoneNumber?.trim())
        errors.phoneNumber = "Mobile is required";
      if (!values.gender) errors.gender = "Gender is required";
      if (!values.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
      if (!values.password) errors.password = "Password is required";
      else if (values.password.length < 6)
        errors.password = "Password must be at least 6 characters";
      if (!values.confirm) errors.confirm = "Please confirm password";
      else if (values.confirm !== values.password)
        errors.confirm = "Passwords do not match";

      const f = values.imageFile;
      if (!f) {
        errors.imageFile = "Profile image is required";
      } else {
        if (!ALLOWED_TYPES.includes(f.type))
          errors.imageFile = "Image must be jpeg, png or webp";
        if (f.size > MAX_IMAGE_BYTES)
          errors.imageFile = "Image must be 3MB or smaller";
      }

      return errors as Record<string, string>;
    },
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        // Build FormData
        const formData = new FormData();
        formData.append("name", values.name.trim());
        formData.append("email", values.email.trim().toLowerCase());
        formData.append("gender", values.gender);
        formData.append("dateOfBirth", values.dateOfBirth);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("password", values.password);
        if (values.imageFile)
          formData.append("image", values.imageFile, values.imageFile.name);

        // Send with CORS-friendly options
        let signupRes: Response | null = null;
        try {
          signupRes = await fetch(AUTH_ROUTES.credential.signup, {
            method: "POST",
            body: formData,
          });
        } catch (networkError) {
          console.error("Signup network/CORS error:", networkError);
          toast.error(
            "Network or CORS error while contacting backend. Check backend CORS settings and that the URL is correct."
          );
          return;
        }

        if (!signupRes) {
          toast.error("No response from backend. Please try again.");
          return;
        }

        if (!signupRes.ok) {
          let text = await signupRes.text();
          try {
            const parsed = JSON.parse(text);
            if (parsed && parsed.message) text = parsed.message;
          } catch (e) {
            // keep original text
          }
          toast.error(`Signup failed: ${text}`);
          return;
        }

        const data = await signupRes.json();
        const {
          accessToken,
          refreshToken,
          user: backendUser,
          customer,
        } = data as {
          accessToken?: string;
          refreshToken?: string;
          user?: unknown;
          customer?: unknown;
        };
        const returnedUser = backendUser || customer;
        if (!accessToken || !refreshToken || !returnedUser) {
          toast.error(
            "Signup succeeded but backend did not return tokens. Please sign in."
          );
          return;
        }

        const tokenLoginRes = await signIn("credentials", {
          redirect: false,
          mode: "tokenLogin",
          accessToken,
          refreshToken,
          user: JSON.stringify(returnedUser),
        });

        if (!tokenLoginRes) {
          toast.error("Failed to create session after signup. Please sign in.");
          return;
        }

        if ((tokenLoginRes as unknown as { error?: string }).error) {
          let message = (tokenLoginRes as unknown as { error?: string }).error as string;
          try {
            const parsed = JSON.parse(message);
            if (parsed && parsed.message) message = parsed.message;
          } catch {
            // ignore
          }
          toast.error(message || "Failed to create session after signup.");
          return;
        }

        const session = await getSession();
        if (session && (session.accessToken || session.user?.id)) {
          toast.success("Account created! Welcome to Beaded ✨");
          setTimeout(() => router.push("/"), 300);
        } else {
          toast.error(
            "Signup completed but session not created. Please sign in."
          );
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Signup error";
        console.error("Signup error", error);
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Local helpers to wire custom components to formik
  const setField = (field: string, value: string | File | null) =>
    formik.setFieldValue(field, value);
  const setTouched = (field: string) =>
    formik.setFieldTouched(field, true, false);

  return (
    <div className="">
      <h1 className="text-center text-4xl tracking-wide mb-8">SIGN UP</h1>
      <form
        id="signup-form"
        onSubmit={formik.handleSubmit}
        className="grid mt-6 grid-cols-2 gap-x-10 gap-y-10"
      >
        <div className="relative col-span-1">
          <InputField
            label="Name"
            placeholder="Please enter your Name"
            value={formik.values.name}
            onChange={(v: string) => {
              setField("name", v);
              setTouched("name");
            }}
            inputClassName="border-[#B7B7B7]"
          />
          {formik.touched.name && formik.errors.name && (
            <span className="absolute left-0 top-full mt-1 text-sm text-red-500">
              {formik.errors.name}
            </span>
          )}
        </div>
        <div className="relative col-span-1">
          <InputField
            label="Email"
            placeholder="Please enter your Email"
            value={formik.values.email}
            onChange={(v: string) => {
              setField("email", v);
              setTouched("email");
            }}
            inputClassName="border-[#B7B7B7]"
          />
          {formik.touched.email && formik.errors.email && (
            <span className="absolute left-0 top-full mt-1 text-sm text-red-500">
              {formik.errors.email}
            </span>
          )}
        </div>
        <div className="relative col-span-1">
          <SelectField
            label="Gender"
            value={formik.values.gender}
            onChange={(v: string) => {
              setField("gender", v);
              setTouched("gender");
            }}
            options={genders}
            placeholder="Select Gender"
            triggerClassName="border-[#B7B7B7] bg-white"
          />
          {formik.touched.gender && formik.errors.gender && (
            <span className="absolute left-0 top-full mt-1 text-sm text-red-500">
              {formik.errors.gender}
            </span>
          )}
        </div>
        <div className="relative col-span-1">
          <DatePicker
            label="Date of Birth"
            value={formik.values.dateOfBirth}
            onChange={(v: string) => {
              setField("dateOfBirth", v);
              setTouched("dateOfBirth");
            }}
            placeholder="Select Date"
            inputClassName="border-[#B7B7B7]"
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <span className="absolute left-0 top-full mt-1 text-sm text-red-500">
              {formik.errors.dateOfBirth}
            </span>
          )}
        </div>
        <div className="relative col-span-1">
          <InputField
            label="Mobile"
            placeholder="Please enter your Number"
            value={formik.values.phoneNumber}
            onChange={(v: string) => {
              setField("phoneNumber", v);
              setTouched("phoneNumber");
            }}
            inputClassName="border-[#B7B7B7]"
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <span className="absolute left-0 top-full mt-1 text-sm text-red-500">
              {formik.errors.phoneNumber}
            </span>
          )}
        </div>
        <div className="relative col-span-1">
          <PasswordField
            label="Password"
            placeholder="Please enter your Password"
            value={formik.values.password}
            onChange={(v: string) => {
              setField("password", v);
              setTouched("password");
            }}
            inputClassName="border-[#B7B7B7]"
          />
          {formik.touched.password && formik.errors.password && (
            <span className="absolute left-0 top-full mt-1 text-sm text-red-500">
              {formik.errors.password}
            </span>
          )}
        </div>
        <div className="relative col-span-1">
          <PasswordField
            label="Confirm Password"
            placeholder="Please confirm your Password"
            value={formik.values.confirm}
            onChange={(v: string) => {
              setField("confirm", v);
              setTouched("confirm");
            }}
            inputClassName="border-[#B7B7B7]"
          />
          {formik.touched.confirm && formik.errors.confirm && (
            <span className="absolute left-0 top-full mt-1 text-sm text-red-500">
              {formik.errors.confirm}
            </span>
          )}
        </div>
        <div className="relative col-span-1">
          <FileDropField
            label="Profile Image"
            multiple={false}
            className="border-[#B7B7B7]"
            onFilesChange={(files) => {
              setField("imageFile", files?.[0] ?? null);
              setTouched("imageFile");
            }}
          />
          {formik.touched.imageFile && formik.errors.imageFile && (
            <span className="absolute left-0 top-full mt-1 text-sm text-red-500">
              {formik.errors.imageFile}
            </span>
          )}
        </div>
        <div className="col-span-2 flex justify-center my-5">
          <ReusableButton2
            className="border border-[#B7B7B7] text-black hover:border-[#00b5a6] w-full flex items-center justify-center gap-2"
            bgClassName="bg-[#00b5a6]"
            textClassName="group-hover:text-white"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <FiLoader className="animate-spin size-5" />
              </>
            ) : (
              "Sign up"
            )}
          </ReusableButton2>
        </div>
      </form>
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
