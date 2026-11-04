import BookForm from "@/components/BookForm";
import Protected from "@/components/Protected";

export const metadata = {
  title: "Add Book",
};

export default function AddBookPage() {
  return (
    <Protected>
      <section className="site-container max-w-3xl py-16">
        <p className="eyebrow">Grow the collection</p>

        <h1 className="section-title mb-3 mt-3">
          Add a new book
          <span className="text-[#c18a47]">.</span>
        </h1>

        <p className="mb-8 text-sm text-[#7c887f]">
          Share a book with the BookNook community.
        </p>

        <BookForm />
      </section>
    </Protected>
  );
}