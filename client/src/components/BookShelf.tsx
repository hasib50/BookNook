"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Spine = {
  label?: string;
  href?: string;
  number?: string;
  height: number;
  bg: string;
  fg: string;
};

const spines: Spine[] = [
  { height: 250, bg: "#8c5a3c", fg: "#f1dcc0" },
  { label: "Fiction", href: "/books?category=Fiction", number: "01", height: 320, bg: "#173b30", fg: "#e5b978" },
  { height: 280, bg: "#c39a50", fg: "#173b30" },
  { label: "Science", href: "/books?category=Science", number: "02", height: 300, bg: "#2f5d73", fg: "#f1e6cf" },
  { height: 240, bg: "#6b2f3a", fg: "#f1dcc0" },
  { label: "History", href: "/books?category=History", number: "03", height: 335, bg: "#7a4e2d", fg: "#f6e3b8" },
  { height: 270, bg: "#244b3b", fg: "#e5b978" },
  { label: "Kids", href: "/books?category=Kids", number: "04", height: 290, bg: "#d98f3e", fg: "#3a2410" },
  { height: 255, bg: "#3b3a5c", fg: "#f1e6cf" },
  { label: "Others", href: "/books?category=Others", number: "05", height: 310, bg: "#5b6b3a", fg: "#f6efd8" },
  { height: 235, bg: "#a24c3a", fg: "#f6e3d0" },
];

export default function BookShelf() {
  return (
    <section className="shelf-section">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">Browse the shelf</p>

          <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight text-[#24352c] md:text-5xl">
            Pick a spine
            <span className="text-[#c39a50]">.</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#7c887f]">
            Every labelled spine opens a shelf. Hover or tap one to pull it
            out and see what is inside.
          </p>
        </div>

        <div className="shelf-scroll">
          <div className="shelf-case">
            <div className="shelf-row">
              {spines.map((spine, index) => {
                const style = {
                  height: spine.height,
                  "--spine-bg": spine.bg,
                  "--spine-fg": spine.fg,
                } as React.CSSProperties;

                return (
                  <motion.div
                    key={index}
                    className="flex items-end"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    {spine.href ? (
                      <Link
                        href={spine.href}
                        className="spine"
                        style={style}
                        aria-label={`Browse ${spine.label} books`}
                      >
                        <span className="spine-num">{spine.number}</span>
                        <span className="spine-title">{spine.label}</span>
                        <span className="spine-band" />
                      </Link>
                    ) : (
                      <span className="spine" style={style} aria-hidden="true">
                        <span className="spine-band" />
                        <span className="spine-band" />
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="shelf-board" />
          </div>
        </div>
      </div>
    </section>
  );
}