"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import type { Product } from "@/lib/products";
import { Photo } from "./Photo";
import { ShopifyBuyButton } from "./ShopifyBuyButton";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;
// `iframe` is included so the Shopify buy button (rendered in an iframe) stays
// reachable inside the focus trap.
const FOCUSABLE =
  'a[href], button:not([disabled]), input, iframe, [tabindex]:not([tabindex="-1"])';

const clampIndex = (i: number, count: number) =>
  Math.max(0, Math.min(count - 1, i));

const trackTransition = (reduce: boolean | null) =>
  reduce
    ? { duration: 0 }
    : ({ type: "tween", duration: 0.5, ease: EASE } as const);

/** A single overlaid navigation arrow (desktop only). Disabled at the boundary. */
function GalleryArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-bone/85 text-umber shadow-[0_6px_20px_-8px_rgba(58,46,32,0.6)] backdrop-blur-sm transition md:flex",
        dir === "prev" ? "left-3" : "right-3",
        disabled
          ? "cursor-not-allowed opacity-0"
          : "opacity-100 hover:bg-bone hover:text-espresso",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5"
      >
        {dir === "prev" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

/**
 * Image gallery: a draggable/swipeable track of all images plus a thumbnail row.
 * Navigation is bounded (no wrap) — the first image blocks a leftward move and
 * the last blocks a rightward one. Desktop shows arrows; mobile swipes.
 */
function Gallery({
  product,
  active,
  setActive,
  reduce,
}: {
  product: Product;
  active: number;
  setActive: (i: number) => void;
  reduce: boolean | null;
}) {
  const gallery = product.gallery ?? [];
  const count = gallery.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Measure the viewport width so the track can translate in pixels and the
  // drag can be constrained precisely to the first/last slide.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Drive the track position directly with a MotionValue so it can always be
  // re-snapped to the active slide. Relying on framer's `animate` prop alone is
  // not enough: with dragMomentum disabled, a drag settles wherever the finger
  // lifts, and the prop only re-animates when `active` changes — so a boundary
  // drag or a sub-threshold nudge would leave the track resting mid-slide.
  const x = useMotionValue(0);

  const go = useCallback(
    (i: number) => setActive(clampIndex(i, count)),
    [setActive, count],
  );

  const atStart = active === 0;
  const atEnd = active === count - 1;

  // Snap to the active slide whenever it changes (arrows/thumbnails/keyboard)
  // or the viewport is (re)measured.
  useEffect(() => {
    const controls = animate(x, -active * width, trackTransition(reduce));
    return () => controls.stop();
  }, [active, width, reduce, x]);

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    const distance = width * 0.18; // ~a fifth of a slide commits the move
    const flung = Math.abs(info.velocity.x) > 500;
    let dir = 0;
    if (info.offset.x < -distance || (flung && info.velocity.x < 0)) dir = 1;
    else if (info.offset.x > distance || (flung && info.velocity.x > 0)) dir = -1;

    const next = clampIndex(active + dir, count);
    if (next !== active) {
      setActive(next); // the effect above animates the track to the new slide
    } else {
      // no-op move (boundary or sub-threshold): re-snap to the current slide
      animate(x, -active * width, trackTransition(reduce));
    }
  };

  return (
    <div className="bg-linen p-4 sm:p-6">
      <div ref={trackRef} className="relative overflow-hidden rounded-sm">
        <motion.div
          className={cn("flex", count > 1 && "cursor-grab active:cursor-grabbing")}
          drag={count > 1 ? "x" : false}
          dragConstraints={{ left: -width * (count - 1), right: 0 }}
          dragElastic={reduce ? 0 : 0.12}
          dragMomentum={false}
          style={{ x }}
          onDragEnd={onDragEnd}
        >
          {gallery.map((src, i) => (
            <div key={src + i} className="w-full shrink-0 select-none">
              <Photo
                src={src}
                alt={i === active ? product.alt : ""}
                label={product.name}
                sizes="(max-width: 768px) 92vw, 45vw"
                className="pointer-events-none aspect-square w-full rounded-sm"
                priority={i === 0}
              />
            </div>
          ))}
        </motion.div>

        {count > 1 && (
          <>
            <GalleryArrow dir="prev" disabled={atStart} onClick={() => go(active - 1)} />
            <GalleryArrow dir="next" disabled={atEnd} onClick={() => go(active + 1)} />
          </>
        )}
      </div>

      {count > 1 && (
        <div aria-live="polite" className="sr-only">
          {`Image ${active + 1} of ${count}`}
        </div>
      )}

      {count > 1 && (
        <div
          role="group"
          aria-label={`${product.name} images`}
          className="mt-3 flex gap-3 overflow-x-auto pb-1"
        >
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === active}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-sm ring-1 ring-umber/15 transition",
                i === active ? "ring-2 ring-olive" : "opacity-80 hover:opacity-100",
              )}
            >
              <Photo src={src} alt="" className="h-16 w-16" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Centered quick-view modal: image gallery (main image + thumbnail row, swipeable
 * on mobile, arrow-navigable on desktop) plus the product details and the
 * Pre-order link. Closes via the X button, Escape, or a click on the backdrop.
 * Traps focus while open, locks body scroll, and restores focus to the trigger.
 */
export function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  const gallery = product?.gallery ?? [];
  const count = gallery.length;

  const step = useCallback(
    (dir: number) => setActive((i) => clampIndex(i + dir, count)),
    [count],
  );

  // Open/close side effects: remember the trigger, lock scroll, focus the close
  // button, listen for Escape + arrow keys — then undo it all on close.
  useEffect(() => {
    if (!product) return;

    setActive(0);
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreRef.current?.focus?.();
    };
  }, [product, onClose, step]);

  // keep focus inside the dialog while tabbing
  function onKeyDownTrap(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-espresso/55 p-4 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quickview-title"
            aria-describedby="quickview-desc"
            onKeyDown={onKeyDownTrap}
            className="relative my-auto flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-md bg-bone shadow-[0_24px_70px_-24px_rgba(58,46,32,0.55)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-bone/80 text-umber backdrop-blur-sm transition-colors hover:bg-umber/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="grid min-h-0 overflow-y-auto md:grid-cols-2">
              <Gallery
                product={product}
                active={active}
                setActive={setActive}
                reduce={reduce}
              />

              {/* details */}
              <div className="flex flex-col gap-5 p-6 pt-12 sm:p-8 md:pt-8 lg:p-10">
                <h2
                  id="quickview-title"
                  className="font-serif text-[1.7rem] font-medium leading-tight text-umber sm:text-[2rem]"
                >
                  {product.name}
                </h2>

                {product.verse ? (
                  <p className="font-serif text-xl italic leading-snug text-espresso/85">
                    &ldquo;{product.verse}&rdquo;
                    {product.reference ? (
                      <span className="mt-1 block font-sans text-xs not-italic uppercase tracking-wide2 text-olive">
                        {product.reference}
                      </span>
                    ) : null}
                  </p>
                ) : null}

                <p
                  id="quickview-desc"
                  className="font-sans text-base leading-relaxed text-espresso/85"
                >
                  {product.description}
                </p>

                <div className="border-t border-umber/10 pt-5">
                  <span className="font-sans text-[0.7rem] uppercase tracking-wide2 text-olive">
                    Materials &amp; care
                  </span>
                  <p className="mt-2 font-sans text-base leading-relaxed text-espresso/75">
                    {product.materialsCare}
                  </p>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <span className="font-serif text-2xl text-umber">
                    {product.price}
                  </span>
                  {product.shopifyId ? (
                    <ShopifyBuyButton
                      productId={product.shopifyId}
                      domId={`shopify-modal-${product.id}`}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
