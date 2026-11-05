import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "BookNook | Home",
    template: "BookNook | %s",
  },
  description:
    "Explore a world of stories. Discover, share, and borrow your favorite books with BookNook.",
};

// Apply saved theme before page rendering
const themeScript = `
(function () {
  try {
    var theme = localStorage.getItem("booknook-theme") || "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>

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