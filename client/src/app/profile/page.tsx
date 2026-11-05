"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import Protected from "@/components/Protected";
import Avatar from "@/components/Avatar";
import { authClient } from "@/lib/auth-client";

function ProfileContent() {
  const { data: session } = authClient.useSession();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  function startEdit() {
    setName(session?.user.name || "");
    setEditing(true);
  }

  function cancelEdit() {
    if (busy) return;
    setEditing(false);
  }

  async function saveName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = name.trim();

    if (trimmed.length < 2) {
      toast.error("Name must be at least 2 characters long.");
      return;
    }

    if (trimmed.length > 50) {
      toast.error("Name must be 50 characters or fewer.");
      return;
    }

    if (trimmed === session?.user.name) {
      setEditing(false);
      return;
    }

    setBusy(true);

    const result = await authClient.updateUser({ name: trimmed });

    setBusy(false);

    if (result.error) {
      toast.error(result.error.message || "Could not update your name.");
      return;
    }

    toast.success("Your name has been updated!");
    setEditing(false);
  }

  return (
    <section className="site-container max-w-2xl py-16">
      <p className="eyebrow">Your account</p>

      <h1 className="section-title mt-3">
        My profile
        <span className="text-[#c18a47]">.</span>
      </h1>

      <div className="form-panel mt-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar
            src={session?.user.image}
            name={session?.user.name}
            className="h-20 w-20 text-2xl"
            iconSize={32}
            showInitial
          />

          <div className="min-w-0 flex-1">
            {editing ? (
              <form onSubmit={saveName}>
                <label className="field-label">
                  Full name
                  <input
                    autoFocus
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    disabled={busy}
                    placeholder="Enter your name"
                    className="input-field"
                  />
                </label>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Save Name
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={busy}
                    className="btn-outline-soft disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">
                    {session?.user.name}
                  </h2>

                  <p className="mt-1 truncate text-sm text-[#78857b]">
                    {session?.user.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={startEdit}
                  className="btn-outline-soft shrink-0"
                >
                  <Pencil size={15} />
                  Edit Name
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Email is read-only because it is the account identity */}
        {editing && (
          <p className="mt-5 border-t border-[#e9e4d9] pt-4 text-xs text-[#8b9189]">
            Signed in as {session?.user.email}. Email address cannot be
            changed.
          </p>
        )}
      </div>
    </section>
  );
}

export default function Profile() {
  return (
    <Protected>
      <ProfileContent />
    </Protected>
  );
}