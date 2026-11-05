import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Book",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
