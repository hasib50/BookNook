"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Library,
  UserRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/types/book";
import Protected from "@/components/Protected";

function BookDetailsContent() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.title = book ? `BookNook | ${book.title}` : "BookNook | Book Details";
  }, [book]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBook() {
      try {
        const response = await api.get(`/books/${id}`, {
          signal: controller.signal,
        });
        setBook(response.data);
      } catch {
        if (!controller.signal.aborted) setBook(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchBook();
    return () => controller.abort();
  }, [id]);

  async function confirmBorrow() {
    if (!book || busy) return;

    setBusy(true);

    try {
      await api.post("/borrows", { bookId: id });
      toast.success("Book borrowed successfully!");
      setModalOpen(false);

      const response = await api.get(`/books/${id}`);
      setBook(response.data);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Could not borrow this book.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[65vh] place-items-center">
        <span className="loading loading-spinner loading-lg text-[#31594c]" />
      </div>
    );
  }

  if (!book) {
    return (
      <section className="site-container py-24 text-center">
        <BookOpen className="mx-auto mb-5 h-14 w-14 text-[#9caa9e]" />
        <h1 className="section-title">Book Not Found</h1>
        <p className="mt-3 text-[#78857b]">Sorry, we could not find this book.</p>
        <Link href="/books" className="btn-primary mt-7 inline-flex">
          Browse All Books
        </Link>
      </section>
    );
  }

  const isAvailable = book.availableCopies > 0;

  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 7);

  return (
    <section className="overflow-hidden bg-[#faf9f5]">
      <div className="site-container py-8 md:py-12">
        <Link
          href="/books"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#607267] transition hover:text-[#b18a4b]"
        >
          <ArrowLeft size={17} />
          Back to Library
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="grid overflow-hidden rounded-[28px] border border-[#e9e5da] bg-[#fffefa] shadow-[0_20px_70px_rgba(39,65,51,0.07)] md:grid-cols-[0.85fr_1.15fr]"
        >
          {/* Book Cover */}
          <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-[#eaece4] p-8 md:min-h-[680px] md:p-14">
            <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#d3ddcf] opacity-50 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#d8c9a7] opacity-30 blur-3xl" />

            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={book.image}
              alt={book.title}
              className="relative z-10 max-h-[480px] w-full max-w-[330px] rounded-xl object-cover shadow-[15px_20px_35px_rgba(25,40,30,0.25)]"
            />

            <span className="absolute bottom-6 left-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#748174]">
              BookNook Collection
            </span>
          </div>

          {/* Book Information */}
          <div className="flex flex-col justify-center p-7 md:p-12 lg:p-16">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#e9eee7] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#31594c]">
                {book.category}
              </span>

              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${
                  isAvailable
                    ? "bg-[#edf5ed] text-[#3b7952]"
                    : "bg-[#f9e9e5] text-[#b45d4e]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAvailable ? "bg-[#4d9b64]" : "bg-[#c66b59]"
                  }`}
                />
                {isAvailable ? "Available Now" : "Currently Unavailable"}
              </span>
            </div>

            <h1 className="mt-7 font-serif text-4xl font-bold leading-tight tracking-tight text-[#203e31] md:text-5xl lg:text-[58px]">
              {book.title}
            </h1>

            <p className="mt-4 text-base text-[#8a9188]">
              Written by{" "}
              <span className="font-semibold text-[#456453]">{book.author}</span>
            </p>

            <div className="my-8 h-px w-full bg-[#e9e5da]" />

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b18a4b]">
                About This Book
              </p>
              <p className="mt-4 text-[15px] leading-8 text-[#68766d]">
                {book.description}
              </p>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#e9e5da] bg-[#faf9f5] p-5">
                <Library className="mb-3 h-5 w-5 text-[#a48551]" />
                <p className="text-xs text-[#899188]">Total Copies</p>
                <p className="mt-1 text-3xl font-bold text-[#244536]">
                  {book.totalCopies}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e9e5da] bg-[#faf9f5] p-5">
                <BookOpen className="mb-3 h-5 w-5 text-[#a48551]" />
                <p className="text-xs text-[#899188]">Available Copies</p>
                <p className="mt-1 text-3xl font-bold text-[#244536]">
                  {book.availableCopies}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#f2f2eb] p-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#dce5da] text-[#31594c]">
                <UserRound size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#8b958a]">Added to BookNook by</p>
                <p className="truncate text-sm font-semibold text-[#315343]">
                  {book.addedBy?.name || "BookNook Member"}
                </p>
                <p className="truncate text-xs text-[#8b958a]">
                  {book.addedBy?.email || ""}
                </p>
              </div>

              <CheckCircle2 className="ml-auto shrink-0 text-[#78957b]" size={20} />
            </div>

            {/* Borrow Button */}
            <button
              onClick={() => setModalOpen(true)}
              disabled={!isAvailable}
              className="mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#244b3b] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#244b3b]/15 transition duration-300 hover:-translate-y-1 hover:bg-[#315d49] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <BookOpen size={18} />
              {isAvailable ? "Borrow This Book" : "Not Available"}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[#8b958a]">
              <Clock3 size={14} />
              Borrowing period: 7 days
            </p>

            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a0a69d]">
              <CalendarDays size={13} />
              Discover • Read • Return
            </div>
          </div>
        </motion.div>
      </div>

      {/* Borrow Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/45 p-4"
            onClick={() => !busy && setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[#fffefa] p-7 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#203e31]">
                    Borrow this book
                  </h3>
                  <p className="mt-1 text-sm text-[#78857b]">{book.title}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={busy}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-lg text-[#78857b] transition hover:bg-[#edf1e9]"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  confirmBorrow();
                }}
                className="mt-6"
              >
                <label className="field-label">
                  Your name
                  <input
                    readOnly
                    value={session?.user.name || ""}
                    className="input-field cursor-not-allowed opacity-70"
                  />
                </label>

                <label className="field-label mt-4">
                  Your email
                  <input
                    readOnly
                    value={session?.user.email || ""}
                    className="input-field cursor-not-allowed opacity-70"
                  />
                </label>

                <p className="mt-4 flex items-center gap-2 text-xs text-[#8b958a]">
                  <CalendarDays size={14} />
                  Return by {returnDate.toLocaleDateString()}
                </p>

                <button
                  type="submit"
                  disabled={busy}
                  className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Borrow"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function DetailsPage() {
  return (
    <Protected>
      <BookDetailsContent />
    </Protected>
  );
}