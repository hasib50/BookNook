
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Book } from "@/types/book";
import Protected from "@/components/Protected";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import axios from "axios";

function MyBooksContent() {
  const { data: session } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  async function load() {
    try {
      const r = await api.get("/books");

      setBooks(
        r.data.filter(
          (b: Book) => b.addedBy.email === session?.user.email
        )
      );
    } catch {
      toast.error("Could not load your books.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session) load();
  }, [session]);

  async function remove(id: string) {
    try {
      await api.delete(`/books/${id}`);

      setBooks((old) => old.filter((b) => b._id !== id));

      toast.success("Book deleted.");
        } catch (error) {
      toast.error(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
          "Delete failed."
      );
    }
  }

  return (
    <section className="site-container py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your contributions</p>

          <h1 className="section-title mt-3">
            My books
            <span className="text-[#c18a47]">.</span>
          </h1>
        </div>

        <Link href="/add-book" className="btn-primary">
          + Add a book
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : books.length ? (
        <div className="mt-9 overflow-x-auto rounded-2xl border border-[#e9e4d9] bg-[#fffefa]">
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={b.image}
                        className="h-14 w-11 rounded object-cover"
                      />

                      <div>
                        <b>{b.title}</b>
                        <p className="text-xs text-gray-500">
                          {b.author}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>{b.category}</td>

                  <td>
                    {b.availableCopies}/{b.totalCopies}
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <Link
                        href={`/my-books/${b._id}/edit`}
                        className="btn btn-sm"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => setDeleteTarget(b._id)}
                        className="btn btn-sm btn-error btn-outline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-10 rounded-2xl bg-white p-10 text-center text-[#78857b]">
          You have not added any books yet.
        </p>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#fffefa] p-7 shadow-2xl">
            <h3 className="font-serif text-2xl font-bold">
              Delete this book?
            </h3>

            <p className="mt-2 text-sm text-[#78857b]">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn-outline-soft"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  const id = deleteTarget;
                  setDeleteTarget(null);
                  await remove(id);
                }}
                className="btn-primary !bg-red-700"
              >
                Delete book
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function MyBooks() {
  return (
    <Protected>
      <MyBooksContent />
    </Protected>
  );
}
