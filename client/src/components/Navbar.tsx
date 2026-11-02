
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Menu,
  X,
  LogOut,
  UserRound,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const navigation = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add-book", private: true },
  { label: "My Books", href: "/my-books", private: true },
  { label: "My Borrows", href: "/my-borrows", private: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const links = navigation.filter(
    (item) => !item.private || session
  );

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  async function logout() {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully!");
      window.location.href = "/";
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-[#173b30] text-[#f5ead4]">
        <div className="container-custom flex min-h-8 items-center justify-center gap-2 text-center text-[10px] font-medium tracking-[2px] sm:text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d8b16b]" />
          DISCOVER YOUR NEXT FAVORITE BOOK
        </div>
      </div>

      <nav className="border-b border-[#e9e4d9] bg-[#faf8f2]/95 shadow-[0_5px_25px_rgba(30,50,38,0.04)] backdrop-blur-2xl">
        <div className="container-custom flex h-[76px] items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
          >
            <motion.span
              whileHover={{ rotate: -8, scale: 1.06 }}
              className="grid h-11 w-11 place-items-center rounded-xl bg-[#173b30] text-[#e7c78f] shadow-lg shadow-[#173b30]/15"
            >
              <BookOpen size={23} strokeWidth={1.7} />
            </motion.span>

            <span>
              <span className="block font-serif text-[25px] font-bold leading-none tracking-[-1px] text-[#173b30]">
                BookNook<span className="text-[#c69a56]">.</span>
              </span>
              <span className="mt-1 block text-[9px] font-semibold tracking-[3px] text-[#8a877b]">
                YOUR ONLINE LIBRARY
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 xl:flex">
            {links.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative px-3.5 py-3 text-[13px] font-semibold transition-colors duration-300 ${
                    active
                      ? "text-[#173b30]"
                      : "text-[#77796f] hover:text-[#173b30]"
                  }`}
                >
                  {item.label}

                  {active ? (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full bg-[#c69a56]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  ) : (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] scale-x-0 rounded-full bg-[#c69a56] transition-transform duration-300 group-hover:scale-x-100" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop authentication */}
          <div className="hidden items-center gap-3 xl:flex">
            {isPending ? (
              <span className="loading loading-spinner loading-sm text-[#173b30]" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full border border-[#e7e2d7] bg-white/70 py-1.5 pl-1.5 pr-3 transition-all hover:border-[#c69a56] hover:shadow-md"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eee8] text-[#173b30]">
                      <UserRound size={17} />
                    </span>
                  )}

                  <span className="max-w-[105px] truncate text-xs font-bold text-[#173b30]">
                    {session.user.name}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`text-[#8d8c80] transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-14 w-56 overflow-hidden rounded-xl border border-[#e8e2d5] bg-[#fffdf8] p-2 shadow-2xl shadow-[#173b30]/15"
                    >
                      <div className="border-b border-[#eee9df] px-3 py-3">
                        <p className="truncate text-sm font-bold text-[#173b30]">
                          {session.user.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-[#89877d]">
                          {session.user.email}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="mt-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#535d53] transition hover:bg-[#edf1e9] hover:text-[#173b30]"
                      >
                        <UserRound size={17} />
                        My Profile
                      </Link>

                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={17} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-3 text-[13px] font-bold text-[#173b30] transition hover:text-[#bd9251]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="group flex items-center gap-2 rounded-lg bg-[#173b30] px-5 py-3 text-[12px] font-bold tracking-wide text-white shadow-lg shadow-[#173b30]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#244d3e] hover:shadow-xl"
                >
                  Register
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="grid h-10 w-10 place-items-center rounded-lg border border-[#e7e2d7] text-[#173b30] transition hover:bg-[#e9eee8] xl:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden border-t border-[#e9e4d9] bg-[#faf8f2] xl:hidden"
            >
              <div className="container-custom py-5">
                <p className="mb-4 text-[10px] font-bold tracking-[3px] text-[#b08b51]">
                  EXPLORE BOOKNOOK
                </p>

                <div className="flex flex-col">
                  {links.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.045 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between border-b border-[#eae5da] py-4 text-sm font-semibold ${
                          isActive(item.href)
                            ? "text-[#173b30]"
                            : "text-[#77796f]"
                        }`}
                      >
                        {item.label}
                        {isActive(item.href) && (
                          <span className="h-2 w-2 rounded-full bg-[#c69a56]" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {isPending ? (
                  <div className="py-5">
                    <span className="loading loading-spinner loading-sm" />
                  </div>
                ) : session ? (
                  <div className="mt-5 space-y-3">
                    {/* Mobile user information */}
                    <div className="flex items-center gap-3 rounded-xl border border-[#e7e2d7] bg-white p-3">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt="User avatar"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e9eee8] text-[#173b30]">
                          <UserRound size={19} />
                        </span>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#173b30]">
                          {session.user.name}
                        </p>
                        <p className="truncate text-xs text-[#89877d]">
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg bg-[#e9eee8] p-3 text-sm font-semibold text-[#173b30]"
                    >
                      <UserRound size={18} />
                      My Profile
                    </Link>

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-3 rounded-lg border border-red-100 p-3 text-sm font-semibold text-red-600"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg border border-[#173b30] py-3 text-center text-sm font-bold text-[#173b30]"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg bg-[#173b30] py-3 text-center text-sm font-bold text-white"
                    >
                      Register
                    </Link>
                  </div>
                )}

                <p className="mt-6 text-center font-serif text-sm italic text-[#a29c8e]">
                  Every book opens a new world.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
