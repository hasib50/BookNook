
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  function change(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      form.password.length < 6
    ) {
      toast.error(
        "Password needs uppercase, lowercase, and at least 6 characters."
      );
      return;
    }

    setBusy(true);

    try {
      const result = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.image || undefined,
      });

      if (result.error) {
        toast.error(result.error.message || "Registration failed.");
        return;
      }

      toast.success("Account created. Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

   async function handleGoogleLogin() {
    setBusy(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (result?.error) {
        toast.error(
          result.error.message || "Google sign-in failed. Please try again."
        );
        setBusy(false);
      }
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setBusy(false);
    }
  }

  return (
    <section className="site-container grid min-h-[75vh] max-w-5xl items-center gap-10 py-14 md:grid-cols-2">
      <div>
        <p className="eyebrow">Join the community</p>

        <h1 className="section-title mt-3">
          Make space for more stories.
        </h1>

        <p className="mt-5 text-sm leading-7 text-[#7c887f]">
          Create your free account and start discovering the BookNook
          collection.
        </p>
      </div>

      <form onSubmit={submit} className="form-panel">
        <h2 className="font-serif text-3xl font-bold">
          Create account
        </h2>

        <p className="mb-7 mt-2 text-sm text-[#8b9189]">
          A few details and you are in.
        </p>

        <label className="field-label">
          Full name
          <input
            required
            name="name"
            value={form.name}
            onChange={change}
            className="input-field"
          />
        </label>

        <label className="field-label mt-4">
          Email
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={change}
            className="input-field"
          />
        </label>

        <label className="field-label mt-4">
          Photo URL (optional)
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={change}
            className="input-field"
            placeholder="https://..."
          />
        </label>

        <label className="field-label mt-4">
          Password
          <input
            required
            type="password"
            name="password"
            value={form.password}
            onChange={change}
            className="input-field"
          />

          <span className="text-xs font-normal text-[#8b9189]">
            At least 6 characters, one uppercase and one lowercase letter.
          </span>
        </label>

        <button
          type="submit"
          disabled={busy}
          className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Creating…" : "Register"}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-[#a2a69e]">
          <span className="h-px flex-1 bg-[#e9e4d9]" />
          OR
          <span className="h-px flex-1 bg-[#e9e4d9]" />
        </div>

        {/* Google Registration */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={busy}
          className="btn-outline-soft flex w-full items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {/* Google Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="21"
            height="21"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4 6v5h6.5c3.8-3.5 6.1-8.6 6.1-14.7Z"
            />
            <path
              fill="#34A853"
              d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.5-5c-1.8 1.2-4.1 2-7 2-5.3 0-9.8-3.6-11.4-8.4H5.9v5.1C9.3 39.5 16.1 44 24 44Z"
            />
            <path
              fill="#FBBC05"
              d="M12.6 27.8a12 12 0 0 1 0-7.6v-5.1H5.9a20 20 0 0 0 0 17.8l6.7-5.1Z"
            />
            <path
              fill="#EA4335"
              d="M24 11.8c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.7 29.5 4 24 4 16.1 4 9.3 8.5 5.9 15.1l6.7 5.1c1.6-4.8 6.1-8.4 11.4-8.4Z"
            />
          </svg>

          <span>
            {busy ? "Connecting..." : "Continue with Google"}
          </span>
        </button>

        <p className="mt-6 text-center text-sm text-[#78857b]">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-bold text-[#a46e30]"
          >
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}
