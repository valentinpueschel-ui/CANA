"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

const links = [
  { href: "#pieces", label: "The Pieces" },
  { href: "#story", label: "Our Story" },
  { href: "#pieces", label: "Pre-order" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        // Mobile: sits at the top of the page and scrolls away with it — no
        // sticky bar, and no bone-on-bone seam line (the header is transparent
        // over the bone hero). Desktop: the original fixed, translucent overlay.
        "absolute inset-x-0 top-0 z-40 transition-colors duration-300 sm:fixed sm:bg-bone/95 sm:backdrop-blur-sm",
        solid
          ? "sm:border-b sm:border-umber/10"
          : "sm:border-b sm:border-transparent",
      )}
    >
      <Container className="flex h-[72px] items-center justify-between">
        <a
          href="#top"
          className="inline-flex min-h-[44px] items-center font-serif text-2xl uppercase tracking-wordmark text-umber"
          aria-label="Cana — home"
        >
          Cana
        </a>

        {/* desktop nav */}
        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {links.map((l, i) => (
            <a
              key={`${l.href}-${i}`}
              href={l.href}
              className="font-sans text-sm tracking-wide text-espresso/85 transition-colors hover:text-olive"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#pieces"
            className="inline-flex min-h-[40px] items-center rounded-md border border-umber/60 px-5 font-sans text-sm font-medium text-umber transition-colors hover:bg-umber hover:text-bone"
          >
            Reserve a piece
          </a>
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                "absolute left-0 block h-px w-6 bg-umber transition-all duration-300",
                open ? "top-1/2 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1/2 block h-px w-6 bg-umber transition-opacity duration-200",
                open ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-px w-6 bg-umber transition-all duration-300",
                open ? "top-1/2 -rotate-45" : "bottom-0",
              )}
            />
          </span>
        </button>
      </Container>

      {/* mobile menu panel */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden bg-bone md:hidden",
          "transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <Container className="flex flex-col gap-1 pb-6 pt-2">
          {links.map((l, i) => (
            <a
              key={`m-${l.href}-${i}`}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-umber/10 py-4 font-serif text-xl text-umber"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#pieces"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-md bg-umber px-6 font-sans font-medium text-bone"
          >
            Reserve a piece
          </a>
        </Container>
      </div>
    </header>
  );
}
