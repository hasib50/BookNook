
"use client";

import Protected from "@/components/Protected";
import { authClient } from "@/lib/auth-client";

function ProfileContent() {
  const { data: session } = authClient.useSession();

  return (
    <section className="site-container max-w-2xl py-16">
      <p className="eyebrow">Your account</p>

      <h1 className="section-title mt-3">
        My profile
        <span className="text-[#c18a47]">.</span>
      </h1>

      <div className="form-panel mt-8 flex items-center gap-5">
        {session?.user.image ? (
          <img
            src={session.user.image}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[#eae9df] text-2xl">
            {session?.user.name?.[0]}
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold">
            {session?.user.name}
          </h2>

          <p className="mt-1 text-sm text-[#78857b]">
            {session?.user.email}
          </p>
        </div>
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
