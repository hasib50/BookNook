"use client";

import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BookmarkCheck,
  Sparkles,
  LibraryBig,
  BookMarked,
  Quote,
} from "lucide-react";

import api from "@/lib/api";
import BookCard from "@/components/BookCard";
import Marquee from "@/components/Marquee";
import BookShelf from "@/components/BookShelf";
import ReaderReviews from "@/components/ReaderReviews";
import type { Book } from "@/types/book";

const slides = [
  {
    tag: "A world between pages",
    title: "Find your next\nfavorite chapter.",
    text: "Good books make room for new worlds. Explore a community library built for curious minds.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1800&q=85",
    number: "01",
  },
  {
    tag: "Read. Share. Repeat.",
    title: "Stories are better\nwhen they travel.",
    text: "Share the books you love and let another reader discover something wonderful.",
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1800&q=85",
    number: "02",
  },
  {
    tag: "Your reading corner",
    title: "A little library,\na lot of possibility.",
    text: "Browse thoughtful collections, borrow with ease, and keep your reading journey moving.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=85",
    number: "03",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------
   Swiper settings live OUTSIDE the component on purpose.
   If they were written inline, every re-render of Home (for example
   when the books finish loading) would create new objects, and Swiper
   would reset its autoplay, so the slider stopped after one change.
------------------------------------------------------------------- */
const swiperModules = [Autoplay, Pagination, EffectFade];

const autoplayConfig = {
  delay: 4500,
  disableOnInteraction: false,
  pauseOnMouseEnter: false,
};

const paginationConfig = { clickable: true };

/* memo() stops the hero from re-rendering when Home state changes */
const HeroSlider = memo(function HeroSlider() {
  return (
    <section className="container-custom pt-7">
      <Swiper
        modules={swiperModules}
        effect="fade"
        speed={900}
        autoplay={autoplayConfig}
        pagination={paginationConfig}
        rewind
        className="booknook-hero overflow-hidden rounded-[24px] md:rounded-[32px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.number}>
            <div
              className="relative flex min-h-[520px] items-center overflow-hidden bg-cover bg-center px-7 py-16 sm:px-12 md:min-h-[620px] md:px-20"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(13,37,29,.96) 0%, rgba(13,37,29,.82) 48%, rgba(13,37,29,.15) 100%), url(${slide.image})`,
              }}
            >
              {/* Decorative elements */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-12 -top-12 h-[300px] w-[300px] rounded-full border border-white/10" />

              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-[680px] text-white"
              >
                <div className="mb-6 flex items-center gap-3">
                  <Sparkles size={17} className="text-[#e5b978]" />
                  <span className="text-[10px] font-bold uppercase tracking-[4px] text-[#e5b978] sm:text-xs">
                    {slide.tag}
                  </span>
                </div>

                <h1 className="whitespace-pre-line font-serif text-[43px] font-semibold leading-[1.08] tracking-[-1.5px] sm:text-6xl md:text-[76px]">
                  {slide.title}
                  <span className="text-[#e5b978]">.</span>
                </h1>

                <p className="mt-7 max-w-lg text-sm leading-8 text-white/70 sm:text-base">
                  {slide.text}
                </p>

                <Link
                  href="/books"
                  className="group mt-9 inline-flex items-center gap-4 rounded-full bg-[#e5b978] px-7 py-4 text-sm font-bold text-[#173b30] shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                >
                  Browse Books
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <div className="mt-12 flex items-center gap-3">
                  <span className="h-[2px] w-10 bg-[#e5b978]" />
                  <span className="text-xs font-semibold tracking-[3px] text-white/60">
                    BOOKNOOK / {slide.number}
                  </span>
                </div>
              </motion.div>

              <div className="absolute bottom-10 right-10 hidden font-serif text-[100px] font-bold text-white/[0.08] md:block">
                {slide.number}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
});

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/books?limit=6")
      .then((response) => setBooks(response.data))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="overflow-hidden pb-10">
      {/* HERO SLIDER */}
      <HeroSlider />

      {/* TICKER STRIP */}
      <div className="mt-10">
        <Marquee />
      </div>

      {/* INTRODUCTION STRIP */}
      <section className="container-custom py-12">
        <div className="grid grid-cols-1 gap-7 border-b border-[#e6e1d6] pb-12 sm:grid-cols-3 sm:gap-5">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e9eee8] text-[#244b3b]">
              <LibraryBig size={22} />
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#24352c]">
                A Growing Library
              </h3>
              <p className="mt-1 text-xs text-[#81877e]">
                Discover new reading adventures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f4ecdc] text-[#ad8142]">
              <BookMarked size={22} />
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#24352c]">
                Easy Borrowing
              </h3>
              <p className="mt-1 text-xs text-[#81877e]">
                Your next favorite book awaits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e9eee8] text-[#244b3b]">
              <BookmarkCheck size={22} />
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#24352c]">
                Share Knowledge
              </h3>
              <p className="mt-1 text-xs text-[#81877e]">
                Pass meaningful stories along
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-custom py-16 md:py-20">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-10 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="section-label">Fresh on the shelf</p>
            <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight text-[#24352c] md:text-5xl">
              New Arrivals<span className="text-[#c69a56]">.</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#7c887f]">
              The latest additions to our little library.
            </p>
          </div>

          <Link
            href="/books"
            className="group inline-flex items-center gap-3 border-b border-[#c69a56] pb-2 text-sm font-bold text-[#244b3b] transition hover:text-[#b18443]"
          >
            See All Books
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid min-h-[320px] place-items-center">
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg text-[#31594c]" />
              <p className="text-sm font-medium text-[#7c887f]">
                Loading new arrivals...
              </p>
            </div>
          </div>
        ) : books.length > 0 ? (
          <motion.div
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12 },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {books.slice(0, 6).map((book) => (
              <motion.div key={book._id} variants={reveal}>
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d9d2c4] bg-white/50 px-6 py-16 text-center">
            <BookOpen size={38} className="mx-auto text-[#b8aa91]" />
            <h3 className="mt-5 font-serif text-2xl font-bold text-[#24352c]">
              The shelves are waiting.
            </h3>
            <p className="mt-3 text-sm text-[#78857b]">
              No books have been added yet. Be the first to contribute to our
              library.
            </p>
          </div>
        )}
      </section>

      {/* BOOKSHELF (category spines) */}
      <BookShelf />

      {/* EXTRA SECTION 1 - BORROWING */}
      <section className="container-custom py-20">
        <div className="grid overflow-hidden rounded-[28px] bg-[#e8e9df] md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16">
            <p className="section-label">A simpler way to read</p>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#24352c] md:text-5xl">
              Your next chapter
              <span className="italic text-[#a77c42]"> starts here.</span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-8 text-[#69776e]">
              Find a title, confirm your borrow, and enjoy a week with your
              next read. Your borrowed shelf keeps everything organized.
            </p>

            <Link
              href="/books"
              className="group mt-8 inline-flex w-fit items-center gap-3 rounded-lg bg-[#173b30] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#285443]"
            >
              Explore the Shelves
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="relative min-h-[320px] overflow-hidden md:min-h-[480px]">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85"
              alt="A beautiful library filled with books"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#173b30]/10" />

            <div className="absolute bottom-7 right-7 rounded-xl border border-white/30 bg-[#faf8f2]/90 p-5 shadow-xl backdrop-blur-md">
              <Quote size={20} className="text-[#b58a4c]" />
              <p className="mt-2 font-serif text-lg italic text-[#24352c]">
                A book is a world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* READER NOTES */}
      <ReaderReviews />

      {/* EXTRA SECTION 2 - SHARE BOOKS */}
      <section className="container-custom pb-16">
        <div className="relative overflow-hidden rounded-[28px] bg-[#173b30] px-8 py-14 text-center sm:px-14 md:py-20">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full border border-[#d7b779]/20" />

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10 mx-auto max-w-2xl"
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[#e5b978]">
              <BookOpen size={26} />
            </span>

            <p className="mt-7 text-[10px] font-bold tracking-[4px] text-[#e5b978]">
              SHARE THE MAGIC
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
              Pass a good story along.
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-white/65">
              Have a book worth sharing? Add it to BookNook and help another
              reader discover their next favorite.
            </p>

            <Link
              href="/add-book"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#e5b978] px-7 py-4 text-sm font-bold text-[#173b30] transition hover:-translate-y-1 hover:bg-white"
            >
              Share a Book
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}