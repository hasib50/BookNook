"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Protected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      const callbackURL = encodeURIComponent(pathname);
      router.replace(`/login?callbackURL=${callbackURL}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending || !session) {
    return (
      <div className="grid min-h-[55vh] place-items-center">
        <span className="loading loading-spinner loading-lg text-[#31594c]" />
      </div>
    );
  }

  return <>{children}</>;
}