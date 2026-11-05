"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const reviews = [
  {
    name: "Nusrat Jahan",
    role: "Fiction lover",
    text: "I borrowed a novel on Monday and finished it by Saturday. The seven day window is just enough to keep me turning pages.",
    tilt: -1.4,
  },
  {
    name: "Rafiul Karim",
    role: "Science reader",
    text: "Adding my old physics books took two minutes. Knowing a stranger is reading them now makes my shelf feel useful again.",
    tilt: 0.9,
  },
  {
    name: "Tasnim Akter",
    role: "Parent of two",
    text: "My daughter picks a new Kids title every week. Returning one to borrow the next has become our Friday routine.",
    tilt: -0.7,
  },
];

export default function ReaderReviews() {
  return (
    <section className="container-custom py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-label">Reader notes</p>

        <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight text-[#24352c] md:text-5xl">
          Words from our readers
          <span className="text-[#c39a50]">.</span>
        </h2>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {reviews.map((review, index) => (
          <motion.article
            key={review.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: index * 0.12 }}
          >
            <div
              className="note-card"
              style={{ "--tilt": `${review.tilt}deg` } as React.CSSProperties}
            >
              <span className="note-tape" />

              <Quote size={26} className="text-[#c39a50]" />

              <p className="note-text mt-4 flex-1">{review.text}</p>

              <div className="mt-6 flex gap-1 text-[#c39a50]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-[#e9e4d9] pt-4">
                <span className="note-avatar">{review.name[0]}</span>

                <div>
                  <p className="text-sm font-bold text-[#24352c]">
                    {review.name}
                  </p>
                  <p className="text-xs text-[#8b9189]">{review.role}</p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}