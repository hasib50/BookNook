
"use client";

import Protected from "@/components/Protected";
import { authClient } from "@/lib/auth-client";
import Avatar from "@/components/Avatar";

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
        <Avatar
  src={session?.user.image}
  name={session?.user.name}
  className="h-20 w-20 text-2xl"
  iconSize={32}
  showInitial
/>

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
