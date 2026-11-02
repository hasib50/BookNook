
import type { Metadata } from "next";
// @ts-expect-error - CSS imports are handled by Next.js
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "BookNook | A Small Online Library",
    template: "%s | BookNook",
  },
  description:
    "Explore a world of stories. Discover, share, and borrow your favorite books with BookNook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="en">
  <body suppressHydrationWarning>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#244b3b",
              color: "#fff",
            },
          }}
        />

        <Navbar />

        <main className="min-h-[60vh]">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
