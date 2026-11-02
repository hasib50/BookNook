import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import type { Book } from "@/types/book";
export default function BookCard({ book }: { book: Book }) {
  return <article className="book-card group">
    <Link href={`/books/${book._id}`} className="book-cover-wrap">
      <img src={book.image} alt={book.title} className="book-cover transition duration-500 group-hover:scale-[1.04]"/>
      <span className="absolute left-3 top-3 rounded-full bg-[#fffdf8]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#31594c]">{book.category}</span>
    </Link>
    <div className="flex flex-1 flex-col p-5">
      <p className="text-xs text-[#9a8e7b]">by {book.author}</p>
      <h3 className="mt-2 line-clamp-2 font-serif text-xl font-bold leading-snug text-[#203d34]">{book.title}</h3>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-xs font-medium text-[#718078]"><BookOpen size={13} className="mr-1 inline"/> {book.availableCopies} available</span>
        <Link href={`/books/${book._id}`} className="inline-flex items-center gap-1 text-sm font-bold text-[#b27a36]">Details <ArrowUpRight size={16}/></Link>
      </div>
    </div>
  </article>;
}
