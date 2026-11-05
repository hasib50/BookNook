"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const callback = params.get("callbackURL") || "/";

  async function login(e: React.FormEvent) {
    e.preventDefault();

    setBusy(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "Login failed.");
        return;
      }

      toast.success("Welcome back!");
      router.push(callback);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);

    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 15000)
      );

      const result = await Promise.race([
        authClient.signIn.social({
          provider: "google",
          callbackURL: callback,
        }),
        timeout,
      ]);

      if (result?.error) {
        toast.error(
          result.error.message || "Google sign-in failed. Please try again."
        );
        setBusy(false);
      }
    } catch {
      toast.error("Google sign-in is taking too long. Please try again.");
      setBusy(false);
    }
  }

  return (
    <section className="site-container grid min-h-[75vh] max-w-5xl items-center gap-10 py-14 md:grid-cols-2">
      <div>
        <p className="eyebrow">Welcome back</p>

        <h1 className="section-title mt-3">
          Your next chapter starts here.
        </h1>

        <p className="mt-5 text-sm leading-7 text-[#7c887f]">
          Sign in to borrow books, manage your shelf, and keep your
          reading journey close.
        </p>
      </div>

      <form onSubmit={login} className="form-panel">
        <h2 className="font-serif text-3xl font-bold">Sign in</h2>

        <p className="mb-7 mt-2 text-sm text-[#8b9189]">
          Enter your account details to continue.
        </p>

        <label className="field-label">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </label>

        <label className="field-label mt-5">
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </label>

        <div className="mt-2 text-right">
          <button
            type="button"
            onClick={() => toast("Password reset is coming soon.")}
            className="text-xs font-bold text-[#a46e30] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          disabled={busy}
          className="btn-primary mt-6 w-full justify-center"
        >
          {busy ? "Please wait…" : "Login"}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-[#a2a69e]">
          <span className="h-px flex-1 bg-[#e9e4d9]" />
          OR CONTINUE WITH
          <span className="h-px flex-1 bg-[#e9e4d9]" />
        </div>

        <button
          type="button"
          onClick={google}
          disabled={busy}
          className="btn-outline-soft w-full justify-center"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-[#78857b]">
          New to BookNook?{" "}
          <Link href="/register" className="font-bold text-[#a46e30]">
            Create account
          </Link>
        </p>
      </form>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}