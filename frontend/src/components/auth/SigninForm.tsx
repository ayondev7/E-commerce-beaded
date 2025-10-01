"use client";
import React from "react";
import InputField from "@/components/generalComponents/Form/InputField";
import PasswordField from "@/components/generalComponents/Form/PasswordField";
import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleButton";
import Divider from "@/components/auth/Divider";
import ReusableButton2 from "@/components/generalComponents/ReusableButton2";
import { useFormik } from "formik";
import { AUTH_ROUTES } from "@/routes/authRoutes";
import toast from "react-hot-toast";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";

const SigninForm: React.FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [guestSubmitting, setGuestSubmitting] = React.useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.email?.trim()) errors.email = "Email is required";
      else {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(values.email.trim())) errors.email = "Invalid email";
      }
      if (!values.password) errors.password = "Password is required";
      return errors as Record<string, string>;
    },
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const body = {
          email: values.email.trim().toLowerCase(),
          password: values.password,
        };

        let res: Response | null = null;
        try {
          res = await fetch(AUTH_ROUTES.credential.signin, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } catch (networkError) {
          console.error("Signin network/CORS error:", networkError);
          toast.error(
            "Network or CORS error while contacting backend. Check backend CORS settings and that the URL is correct."
          );
          return;
        }

        if (!res) {
          toast.error("No response from backend. Please try again.");
          return;
        }

        if (!res.ok) {
          let text = await res.text();
          try {
            const parsed = JSON.parse(text);
            if (parsed && parsed.message) text = parsed.message;
          } catch {
            // keep original text
          }
          toast.error(`Signin failed: ${text}`);
          return;
        }

        const data = await res.json();
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
            "Signin succeeded but backend did not return tokens. Please try again."
          );
          return;
        }

        // Use NextAuth credentials provider to create session from tokens
        const tokenLoginRes = await signIn("credentials", {
          redirect: false,
          mode: "tokenLogin",
          accessToken,
          refreshToken,
          user: JSON.stringify(returnedUser),
        });

        if (!tokenLoginRes) {
          toast.error(
            "Failed to create session after signin. Please try signing in again."
          );
          return;
        }

        if ((tokenLoginRes as unknown as { error?: string }).error) {
          let message = (tokenLoginRes as unknown as { error?: string })
            .error as string;
          try {
            const parsed = JSON.parse(message);
            if (parsed && parsed.message) message = parsed.message;
          } catch {
            // ignore
          }
          toast.error(message || "Failed to create session after signin.");
          return;
        }

        const session = await getSession();
        if (session && (session.accessToken || session.user?.id)) {
          toast.success("Signed in successfully");
          setTimeout(() => router.push("/"), 300);
        } else {
          toast.error(
            "Signin completed but session not created. Please try signing in."
          );
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Signin error";
        console.error("Signin error", error);
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGuestSignin = async () => {
    setGuestSubmitting(true);
    try {
      let res: Response | null = null;
      try {
        res = await fetch(AUTH_ROUTES.guest.signin, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (networkError) {
        console.error("Guest signin network/CORS error:", networkError);
        toast.error(
          "Network or CORS error while contacting backend. Check backend CORS settings and that the URL is correct."
        );
        return;
      }

      if (!res) {
        toast.error("No response from backend. Please try again.");
        return;
      }

      if (!res.ok) {
        let text = await res.text();
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.message) text = parsed.message;
        } catch {
          // keep original text
        }
        toast.error(`Guest signin failed: ${text}`);
        return;
      }

      const data = await res.json();
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
          "Guest signin succeeded but backend did not return tokens. Please try again."
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
        toast.error(
          "Failed to create session after guest signin. Please try signing in again."
        );
        return;
      }

      if ((tokenLoginRes as unknown as { error?: string }).error) {
        let message = (tokenLoginRes as unknown as { error?: string })
          .error as string;
        try {
          const parsed = JSON.parse(message);
          if (parsed && parsed.message) message = parsed.message;
        } catch {
          // ignore
        }
        toast.error(message || "Failed to create session after guest signin.");
        return;
      }

      const session = await getSession();
      if (session && (session.accessToken || session.user?.id)) {
        toast.success("Signed in as guest successfully");
        setTimeout(() => router.push("/"), 300);
      } else {
        toast.error(
          "Guest signin completed but session not created. Please try signing in."
        );
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Guest signin error";
      console.error("Guest signin error", error);
      toast.error(message);
    } finally {
      setGuestSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <h1 className="text-center text-4xl tracking-wide mb-8">SIGN IN</h1>
      <p className="text-center text-sm text-[#7D7D7D] uppercase mb-2">
        Connect with
      </p>
      <GoogleButton className="border-[#B7B7B7]" label="Sign in with Google" />
      <Divider />
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <InputField
          label="Email"
          placeholder="Enter Email"
          value={formik.values.email}
          onChange={(v: string) => {
            formik.setFieldValue("email", v);
            formik.setFieldTouched("email", true, false);
          }}
          inputClassName="border-[#B7B7B7]"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-sm text-red-500">{formik.errors.email}</div>
        )}
        <PasswordField
          label="Password"
          placeholder="Enter Password"
          value={formik.values.password}
          onChange={(v: string) => {
            formik.setFieldValue("password", v);
            formik.setFieldTouched("password", true, false);
          }}
          inputClassName="border-[#B7B7B7]"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-sm text-red-500">{formik.errors.password}</div>
        )}

        <div className="flex justify-center my-10">
          <ReusableButton2
            className="border border-[#B7B7B7] text-black hover:border-[#00b5a6] w-full flex items-center justify-center gap-2"
            bgClassName="bg-[#00b5a6]"
            textClassName="group-hover:text-white"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <FiLoader className="animate-spin size-5" />
            ) : (
              "Sign in"
            )}
          </ReusableButton2>
        </div>
      </form>
      <div className="flex justify-center mb-6">
        <ReusableButton2
          className="border border-[#B7B7B7] text-black hover:border-[#00b5a6] w-full flex items-center justify-center gap-2"
          bgClassName="bg-[#00b5a6]"
          textClassName="group-hover:text-white"
          onClick={handleGuestSignin}
          disabled={guestSubmitting}
        >
          {guestSubmitting ? (
            <FiLoader className="animate-spin size-5" />
          ) : (
            "Sign in as a Guest"
          )}
        </ReusableButton2>
      </div>
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
