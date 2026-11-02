
import Link from "next/link";
import {
  BookOpen,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Sparkles,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

const socials = [
  {
    icon: Facebook,
    href: "https://facebook.com",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: Github,
    href: "https://github.com",
    label: "GitHub",
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-[#173b30] text-[#f7f2e8]">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#d3b47c]/10" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#d3b47c]/10" />

      {/* Newsletter style banner */}
      <div className="container-custom relative border-b border-white/10 py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[#d7b779]">
              <Sparkles size={15} />
              <span className="text-[10px] font-bold tracking-[3px]">
                THE JOY OF READING
              </span>
            </div>

            <h2 className="max-w-xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              Every great story begins
              <span className="italic text-[#d7b779]"> with a book.</span>
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-7 text-[#d2d9d1]/70">
              Discover new perspectives, explore timeless stories,
              and make every reading moment memorable.
            </p>
          </div>

          <Link
            href="/books"
            className="group flex shrink-0 items-center gap-3 rounded-lg border border-[#d7b779]/50 px-6 py-3.5 text-sm font-semibold text-[#e6ca96] transition-all duration-300 hover:bg-[#d7b779] hover:text-[#173b30]"
          >
            Explore Books
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom relative grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand information */}
        <div className="lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e5c68d] text-[#173b30]">
              <BookOpen size={23} />
            </span>

            <span className="font-serif text-2xl font-bold tracking-tight">
              BookNook<span className="text-[#d7b779]">.</span>
            </span>
          </Link>

          <p className="mt-6 max-w-xs text-sm leading-7 text-[#d2d9d1]/70">
            Your little corner of the literary world. Discover,
            share, and borrow books to make every story part of
            your journey.
          </p>

          <div className="mt-7 flex items-center gap-3">
            {socials.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-[#e5d8be] transition-all duration-300 hover:-translate-y-1 hover:border-[#d7b779] hover:bg-[#d7b779] hover:text-[#173b30]"
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-7 font-serif text-xl font-semibold">
            Quick Links
          </h3>

          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-[#d2d9d1]/70 transition-colors hover:text-[#e5c68d]"
                >
                  <span className="h-px w-0 bg-[#d7b779] transition-all duration-300 group-hover:w-4" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-7 font-serif text-xl font-semibold">
            Categories
          </h3>

          <ul className="space-y-4">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/books?category=${category.toLowerCase()}`}
                  className="group flex items-center gap-2 text-sm text-[#d2d9d1]/70 transition-colors hover:text-[#e5c68d]"
                >
                  <span className="h-px w-0 bg-[#d7b779] transition-all duration-300 group-hover:w-4" />
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-7 font-serif text-xl font-semibold">
            Get in Touch
          </h3>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Mail
                size={18}
                className="mt-1 shrink-0 text-[#d7b779]"
              />
              <div>
                <p className="text-xs text-[#d2d9d1]/50">
                  Email us
                </p>
                <a
                  href="mailto:hello@booknook.com"
                  className="mt-1 block break-all text-sm text-[#eee7d9] transition hover:text-[#d7b779]"
                >
                  hello@booknook.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone
                size={18}
                className="mt-1 shrink-0 text-[#d7b779]"
              />
              <div>
                <p className="text-xs text-[#d2d9d1]/50">
                  Call us
                </p>
                <a
                  href="tel:+8801700000000"
                  className="mt-1 block text-sm text-[#eee7d9] transition hover:text-[#d7b779]"
                >
                  +880 1700-000000
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin
                size={18}
                className="mt-1 shrink-0 text-[#d7b779]"
              />
              <div>
                <p className="text-xs text-[#d2d9d1]/50">
                  Location
                </p>
                <p className="mt-1 text-sm text-[#eee7d9]">
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#d2d9d1]/60">
            © {new Date().getFullYear()} BookNook. All rights reserved.
          </p>

          <p className="font-serif text-sm italic text-[#d7b779]">
            Made for the love of reading.
          </p>
        </div>
      </div>
    </footer>
  );
}
