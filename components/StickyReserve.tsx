"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * A persistent "Reserve" bar that slides up on mobile once the visitor scrolls
 * past the hero, keeping the primary action always one tap away. Hidden on
 * desktop (the header CTA stays visible there) and under the modal (z-40).
 */
export function StickyReserve() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-umber/10 bg-bone/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-sm sm:hidden"
          initial={reduce ? { opacity: 0 } : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 80, opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="#pieces"
            className="flex min-h-[48px] items-center justify-center rounded-md bg-umber font-sans font-medium text-bone transition-colors hover:bg-espresso"
          >
            Reserve your piece
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
