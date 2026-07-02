"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Sprig } from "./Sprig";

const PATHS = [
  "M6 14 H58", // stem
  "M18 14 c-3 -6 -9 -7 -12 -5 c2 4 8 7 12 5Z", // upper-left leaf
  "M30 14 c3 -6 9 -7 12 -5 c-2 4 -8 7 -12 5Z", // upper-right leaf
  "M42 14 c-3 6 -9 7 -12 5 c2 -4 8 -7 12 -5Z", // lower-left leaf
  "M42 14 c3 6 9 7 12 5 c-2 -4 -8 -7 -12 -5Z", // lower-right leaf
  "M58 14 c3 -3 4 -7 3 -10 c-3 2 -5 6 -3 10Z", // tip
];

/**
 * The olive sprig that draws itself as it scrolls into view — the recurring
 * Cana motif, given a quiet flourish. Falls back to the static Sprig when the
 * visitor prefers reduced motion.
 */
export function DrawnSprig({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <Sprig className={className} />;

  return (
    <motion.svg
      viewBox="0 0 64 28"
      fill="none"
      aria-hidden="true"
      className={cn(className)}
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {PATHS.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            show: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
        />
      ))}
    </motion.svg>
  );
}
