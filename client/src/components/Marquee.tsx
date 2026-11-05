"use client";

import { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

const phrases = [
  "Add a book",
  "Borrow a book",
  "Return a book",
  "Seven days of stories",
  "Share what you love",
  "Discover your next read",
];

const SPEED = 60; // pixels per second

function Group() {
  return (
    <div className="marquee-group">
      {[...phrases, ...phrases].map((text, index) => (
        <span key={index} className="marquee-item">
          {text}
          <i>✦</i>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    const track = trackRef.current;
    if (!track || paused.current) return;

    // Limit delta so the strip never jumps after a tab switch
    const step = (Math.min(delta, 50) / 1000) * SPEED;
    offset.current -= step;

    // The track holds two identical groups, so loop after one group
    const half = track.scrollWidth / 2;
    if (half > 0 && -offset.current >= half) {
      offset.current += half;
    }

    track.style.transform = `translate3d(${offset.current}px, 0, 0)`;
  });

  return (
    <div
      className="marquee"
      aria-hidden="true"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div ref={trackRef} className="marquee-track">
        <Group />
        <Group />
      </div>
    </div>
  );
}