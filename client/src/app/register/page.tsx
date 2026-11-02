
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

    const result = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      image: form.image || undefined,
    });

    setBusy(false);

    if (result.error) {
      toast.error(result.error.message || "Registration failed.");
      return;
    }

    toast.success("Account created. Please sign in.");
    router.push("/login");
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
          disabled={busy}
          className="btn-primary mt-6 w-full justify-center"
        >
          {busy ? "Creating…" : "Register"}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-[#a2a69e]">
          <span className="h-px flex-1 bg-[#e9e4d9]" />
          OR
          <span className="h-px flex-1 bg-[#e9e4d9]" />
        </div>

        <button
          type="button"
          onClick={async () => {
            setBusy(true);
            await authClient.signIn.social({
              provider: "google",
              callbackURL: "/",
            });
          }}
          disabled={busy}
          className="btn-outline-soft w-full justify-center"
        >
          Continue with Google
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
