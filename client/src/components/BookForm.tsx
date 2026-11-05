"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Book } from "@/types/book";
import { authClient } from "@/lib/auth-client";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function BookForm({ initial }: { initial?: Book }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [previewFailed, setPreviewFailed] = useState(false);

  const [form, setForm] = useState({
    title: initial?.title || "",
    author: initial?.author || "",
    category: initial?.category || "Fiction",
    image: initial?.image || "",
    description: initial?.description || "",
    totalCopies: String(initial?.totalCopies || 1),
  });

  function change(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((old) => ({
      ...old,
      [name]: value,
    }));
  }

  // Upload book cover to ImgBB
  async function uploadImage(file?: File) {
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      toast.error("ImgBB API key is missing.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      return;
    }

    setUploading(true);

    try {
      const body = new FormData();
      body.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Image upload failed.");
      }

      setForm((old) => ({
        ...old,
        image: data.data.url,
      }));
      setPreviewFailed(false);

      toast.success("Cover image uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  // Add or update book
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (busy || uploading) return;

    if (!form.image.trim()) {
      toast.error("Please upload a cover image or paste an image URL.");
      return;
    }

    if (!isValidImageUrl(form.image.trim())) {
      toast.error(
        "Please enter a valid image URL starting with http:// or https://"
      );
      return;
    }

    const copies = Number(form.totalCopies);

    if (!Number.isInteger(copies) || copies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    setBusy(true);

    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category,
        image: form.image.trim(),
        description: form.description.trim(),
        totalCopies: copies,
      };

      if (initial) {
        await api.patch(`/books/${initial._id}`, payload);
      } else {
        await api.post("/books", payload);
      }

      toast.success(
        initial ? "Book updated successfully!" : "Book added to the library!"
      );

      router.push("/my-books");
      router.refresh();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };

        toast.error(
          apiError.response?.data?.message || "Something went wrong."
        );
      } else {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong."
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="form-panel">
      <div className="grid gap-5 md:grid-cols-2">
        {/* Book Title */}
        <label className="field-label">
          Book title
          <input
            required
            name="title"
            value={form.title}
            onChange={change}
            className="input-field"
            placeholder="The name of the book"
          />
        </label>

        {/* Author */}
        <label className="field-label">
          Author name
          <input
            required
            name="author"
            value={form.author}
            onChange={change}
            className="input-field"
            placeholder="Author's full name"
          />
        </label>

        {/* Category */}
        <label className="field-label">
          Category
          <select
            name="category"
            value={form.category}
            onChange={change}
            className="input-field"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        {/* Total Copies */}
        <label className="field-label">
          Total copies
          <input
            required
            min="1"
            step="1"
            type="number"
            name="totalCopies"
            value={form.totalCopies}
            onChange={change}
            className="input-field"
          />
        </label>

        {/* Added by (read-only) */}
        {!initial && (
          <>
            <label className="field-label">
              Your name
              <input
                readOnly
                value={session?.user.name || ""}
                className="input-field cursor-not-allowed opacity-70"
              />
            </label>

            <label className="field-label">
              Your email
              <input
                readOnly
                value={session?.user.email || ""}
                className="input-field cursor-not-allowed opacity-70"
              />
            </label>
          </>
        )}

        {/* Book Cover */}
        <div className="field-label md:col-span-2">
          Book cover image

          <div className="mt-2 inline-flex w-fit rounded-xl border border-[#e9e4d9] p-1">
            {(["upload", "url"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setImageMode(mode)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  imageMode === mode
                    ? "bg-[#173b30] text-white"
                    : "text-[#68766c] hover:text-[#173b30]"
                }`}
              >
                {mode === "upload" ? "Upload image" : "Paste image URL"}
              </button>
            ))}
          </div>

          {imageMode === "upload" ? (
            <div key="upload-mode">
              <input
                key="cover-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => uploadImage(e.target.files?.[0])}
                className="input-field file-input mt-3"
                disabled={uploading || busy}
              />

              <span className="mt-2 block text-xs font-normal text-[#8b9189]">
                Upload a JPG, PNG or WebP cover. Maximum size 5 MB.
                {uploading && " Uploading image..."}
              </span>
            </div>
          ) : (
            <div key="url-mode">
              <input
                key="cover-url-input"
                type="text"
                inputMode="url"
                name="image"
                value={form.image}
                onChange={(e) => {
                  change(e);
                  setPreviewFailed(false);
                }}
                placeholder="https://example.com/book-cover.jpg"
                className="input-field mt-3"
                disabled={busy}
              />

              <span className="mt-2 block text-xs font-normal text-[#8b9189]">
                Paste a direct link to a JPG, PNG or WebP image.
              </span>
            </div>
          )}

          {form.image && !previewFailed && (
            <div className="mt-4">
              <img
                src={form.image}
                alt="Book cover preview"
                referrerPolicy="no-referrer"
                onError={() => setPreviewFailed(true)}
                className="h-48 w-36 rounded-xl border border-[#e9e4d9] object-cover shadow-sm"
              />

              <p className="mt-2 text-xs text-[#65806e]">
                <span className="mr-1">✓</span>
                Cover image ready
              </p>
            </div>
          )}

          {form.image && previewFailed && (
            <p className="mt-3 text-xs text-[#b45d4e]">
              This image could not be loaded. Please check the link.
            </p>
          )}
        </div>

        {/* Description */}
        <label className="field-label md:col-span-2">
          Short description
          <textarea
            required
            rows={5}
            name="description"
            value={form.description}
            onChange={change}
            className="input-field"
            placeholder="What is this book about?"
          />
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={busy || uploading}
        className="btn-primary mt-7 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading
          ? "Uploading image..."
          : busy
            ? "Saving..."
            : initial
              ? "Save Changes"
              : "Add Book"}
      </button>
    </form>
  );
}