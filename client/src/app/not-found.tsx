
import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="site-container grid min-h-[65vh] place-items-center py-20 text-center">
      <div>
        <p className="font-serif text-8xl font-bold text-[#d6b17a]">
          404
        </p>

        <h1 className="section-title mt-4">
          This page wandered off.
        </h1>

        <p className="mt-3 text-sm text-[#78857b]">
          We could not find the page you were looking for.
        </p>

        <Link href="/" className="btn-primary mt-7">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
