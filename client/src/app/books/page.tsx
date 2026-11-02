
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  ArrowRight,
  LibraryBig,
  X,
} from "lucide-react";

import Link from "next/link";
import api from "@/lib/api";
import BookCard from "@/components/BookCard";
import type { Book } from "@/types/book";

const categories = [
  "All",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function BooksPage() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category");

  const validCategory = categories.find(
    (item) =>
      item.toLowerCase() === initialCategory?.toLowerCase()
  );

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(validCategory || "All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      setLoading(true);

      try {
        const response = await api.get("/books", {
          params: {
            category,
            search: search.trim(),
          },
          signal: controller.signal,
        });

        setBooks(response.data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setBooks([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => controller.abort();
  }, [category, search]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  return (
    <main className="min-h-screen pb-20">

      {/* PAGE HERO */}
      <section className="relative overflow-hidden bg-[#173b30] py-20 md:py-28">
        <div className="pointer-events-none absolute -right-20 -top-36 h-[420px] w-[420px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-24 h-[320px] w-[320px] rounded-full border border-white/10" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <LibraryBig size={18} className="text-[#e5b978]" />
              <span className="text-[10px] font-bold uppercase tracking-[4px] text-[#e5b978]">
                The BookNook Collection
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold leading-tight text-white md:text-7xl">
              Explore All
              <br />
              <span className="italic text-[#e5b978]">
                Books.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-white/65 md:text-base">
              Find a story, discover a new perspective, or
              explore something you have never read before.
              Your next favorite book might be waiting here.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/60">
              <span className="rounded-full border border-white/20 px-4 py-2">
                Discover
              </span>
              <span className="text-[#e5b978]">✦</span>
              <span className="rounded-full border border-white/20 px-4 py-2">
                Read
              </span>
              <span className="text-[#e5b978]">✦</span>
              <span className="rounded-full border border-white/20 px-4 py-2">
                Share
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="container-custom pt-16">

        {/* SECTION HEADING */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="section-label">Find your next read</p>

            <h2 className="mt-3 font-serif text-3xl font-bold text-[#24352c] md:text-4xl">
              The Collection
              <span className="text-[#c39a50]">.</span>
            </h2>

            <p className="mt-3 text-sm text-[#7c887f]">
              Browse our collection and discover something meaningful.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#e9eee8] px-4 py-2.5 text-xs font-bold text-[#244b3b]">
            <BookOpen size={16} />
            {loading ? "Loading..." : `${books.length} Books Found`}
          </div>
        </div>

        {/* SEARCH & FILTER PANEL */}
        <div className="mb-10 rounded-2xl border border-[#e9e6dc] bg-white p-5 shadow-[0_8px_30px_rgba(36,53,44,0.04)] md:p-7">

          <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#24352c]">
            <SlidersHorizontal size={17} className="text-[#b18443]" />
            Find Your Book
          </div>

          <div className="flex flex-col gap-4 md:flex-row">

            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9d94]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by book title or author..."
                className="input-field h-[48px] pl-11 pr-4"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#92978e] transition hover:text-[#244b3b]"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* CATEGORY */}
            <div className="relative md:w-56">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field h-[48px] cursor-pointer appearance-none pr-10"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>

              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9a9d94]"
              />
            </div>
          </div>

          {/* CATEGORY CHIPS */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
                  category === item
                    ? "bg-[#173b30] text-white shadow-md shadow-[#173b30]/15"
                    : "border border-[#e8e4da] bg-[#faf8f2] text-[#68766c] hover:border-[#244b3b] hover:text-[#244b3b]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* BOOK RESULTS */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[#59695e]">
            {loading
              ? "Finding your books..."
              : `Showing ${books.length} ${books.length === 1 ? "book" : "books"}`}
          </p>

          {(search || category !== "All") && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#a5793e] transition hover:text-[#173b30]"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[370px] animate-pulse rounded-2xl border border-[#e9e6dc] bg-white"
              />
            ))}
          </div>
        ) : books.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {books.map((book) => (
              <motion.div
                key={book._id}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-[#d9d2c4] bg-white/60 px-6 py-20 text-center"
          >
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e9eee8] text-[#244b3b]">
              <BookOpen size={30} />
            </span>

            <h3 className="mt-6 font-serif text-2xl font-bold text-[#24352c]">
              No books found.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#7c887f]">
              We could not find any books matching your search.
              Try another title or explore a different category.
            </p>

            <button
              onClick={clearFilters}
              className="btn-primary mt-7"
            >
              Clear Filters
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="container-custom mt-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#e9eee8] p-8 sm:p-10 md:flex-row md:items-center">
          <div>
            <p className="section-label">Be part of the collection</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#24352c]">
              Have a book to share?
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#718076]">
              Help another reader discover a wonderful story.
            </p>
          </div>

          <Link
            href="/add-book"
            className="btn-primary shrink-0"
          >
            Add a Book
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
