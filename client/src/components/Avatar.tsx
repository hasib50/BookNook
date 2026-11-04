"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";

type AvatarProps = {
  src?: string | null;
  name?: string | null;
  className?: string;
  iconSize?: number;
  showInitial?: boolean;
};

export default function Avatar({
  src,
  name,
  className = "h-8 w-8",
  iconSize = 17,
  showInitial = false,
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const showFallback = !src || failedSrc === src;

  if (showFallback) {
    return (
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-[#e9eee8] text-[#173b30] ${className}`}
      >
        {showInitial && name ? (
          <span className="font-bold uppercase">{name.trim()[0]}</span>
        ) : (
          <UserRound size={iconSize} />
        )}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name ? `${name} avatar` : "User avatar"}
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src)}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}