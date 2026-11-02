
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Borrow } from "@/types/book";
import Protected from "@/components/Protected";
import toast from "react-hot-toast";

function BorrowContent() {
  const [items, setItems] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  async function load() {
    try {
      const r = await api.get("/borrows");
      setItems(r.data);
    } catch {
      toast.error("Could not load your borrows.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function giveBack(id: string) {
    setBusy(id);

    try {
      await api.delete(`/borrows/${id}`);

      setItems((old) => old.filter((x) => x._id !== id));

      toast.success("Book returned successfully.");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Return failed.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="site-container py-16">
      <p className="eyebrow">Your reading list</p>

      <h1 className="section-title mt-3">
        My borrows
        <span className="text-[#c18a47]">.</span>
      </h1>

      {loading ? (
        <div className="py-16 text-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : items.length ? (
        <div className="mt-9 overflow-x-auto rounded-2xl border border-[#e9e4d9] bg-[#fffefa]">
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrow date</th>
                <th>Return date</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {items.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={b.bookImage}
                        className="h-14 w-11 rounded object-cover"
                      />

                      <b>{b.bookTitle}</b>
                    </div>
                  </td>

                  <td>
                    {new Date(b.borrowDate).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(b.returnDate).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      disabled={busy === b._id}
                      onClick={() => giveBack(b._id)}
                      className="btn btn-sm btn-primary"
                    >
                      {busy === b._id ? "Returning…" : "Return Book"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-10 rounded-2xl bg-white p-10 text-center text-[#78857b]">
          You have no active borrows.
        </p>
      )}
    </section>
  );
}

export default function MyBorrows() {
  return (
    <Protected>
      <BorrowContent />
    </Protected>
  );
}
