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
  onOpenZoom,
}: {
  product: Product;
  active: number;
  setActive: (i: number) => void;
  reduce: boolean | null;
  onOpenZoom: () => void;
}) {
  const gallery = product.gallery ?? [];
  const count = gallery.length;
  const trackRef = useRef<HTMLDivElement>(null);
  // distinguishes a genuine tap (open the zoom view) from the end of a swipe.
  const draggingRef = useRef(false);
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
      {/* touch-none: the horizontal swipe never turns into a vertical page scroll */}
      <div ref={trackRef} className="relative touch-none overflow-hidden rounded-sm">
        <motion.div
          className={cn(
            "flex cursor-zoom-in",
            count > 1 && "active:cursor-grabbing",
          )}
          drag={count > 1 ? "x" : false}
          dragDirectionLock
          dragConstraints={{ left: -width * (count - 1), right: 0 }}
          dragElastic={reduce ? 0 : 0.12}
          dragMomentum={false}
          style={{ x }}
          onPointerDown={() => {
            draggingRef.current = false;
          }}
          onDragStart={() => {
            draggingRef.current = true;
          }}
          onDragEnd={onDragEnd}
          onClick={() => {
            // ignore the click that ends a swipe; a real tap opens the zoom view
            if (draggingRef.current) return;
            onOpenZoom();
          }}
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

        {/* keyboard-accessible zoom affordance (the image also opens on tap) */}
        <button
          type="button"
          onClick={onOpenZoom}
          aria-label="View image larger"
          className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bone/85 text-umber backdrop-blur-sm transition hover:bg-bone"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-[18px] w-[18px]"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
          </svg>
        </button>
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
 * Full-screen image viewer ("lightbox"). Opens when the shopper taps the main
 * gallery image, so they can inspect a piece up close like on a store's product
 * page. Tap the image to zoom in/out; when zoomed, drag to pan. Arrows (desktop)
 * or swipe (mobile) move between images, bounded. Closes via X / Escape /
 * backdrop. Escape is handled by the parent so it closes the lightbox first.
 */
function Lightbox({
  images,
  active,
  setActive,
  alt,
  name,
  reduce,
  onClose,
}: {
  images: string[];
  active: number;
  setActive: (i: number) => void;
  alt: string;
  name: string;
  reduce: boolean | null;
  onClose: () => void;
}) {
  const count = images.length;
  const [zoomed, setZoomed] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // distinguishes a tap (toggle zoom) from the end of a swipe/pan drag.
  const draggingRef = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // scale lives in `style` alongside x/y so all three share one transform
  // (framer ignores an `animate` transform prop when x/y are style MotionValues).
  const scale = useMotionValue(1);

  const atStart = active === 0;
  const atEnd = active === count - 1;

  // A new image always starts un-zoomed and centered.
  useEffect(() => {
    setZoomed(false);
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [active, x, y, scale]);

  // Zoom in/out; zooming back out also glides the pan back to centre.
  useEffect(() => {
    animate(scale, zoomed ? 2.2 : 1, trackTransition(reduce));
    if (!zoomed) {
      animate(x, 0, trackTransition(reduce));
      animate(y, 0, trackTransition(reduce));
    }
  }, [zoomed, x, y, scale, reduce]);

  useEffect(() => {
    const t = window.setTimeout(() => closeRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, []);

  const goTo = (i: number) => setActive(clampIndex(i, count));

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (zoomed) return; // when zoomed, a drag pans the image (no navigation)
    const w = stageRef.current?.clientWidth ?? 0;
    const distance = Math.max(60, w * 0.12);
    const flung = Math.abs(info.velocity.x) > 500;
    let dir = 0;
    if (info.offset.x < -distance || (flung && info.velocity.x < 0)) dir = 1;
    else if (info.offset.x > distance || (flung && info.velocity.x > 0)) dir = -1;
    const next = clampIndex(active + dir, count);
    if (next !== active) setActive(next); // the effect above re-centres x
    else animate(x, 0, trackTransition(reduce)); // snap back
  };

  const arrowBase =
    "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-bone/90 text-umber transition md:flex";

  return createPortal(
    <motion.div
      ref={stageRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} — enlarged view`}
      className="fixed inset-0 z-[70] flex touch-none items-center justify-center overflow-hidden bg-espresso/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !zoomed) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close enlarged view"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-bone/90 text-umber transition-colors hover:bg-bone"
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

      {count > 1 && !zoomed && (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={atStart}
            aria-label="Previous image"
            className={cn(arrowBase, "left-4", atStart ? "cursor-not-allowed opacity-0" : "hover:bg-bone")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={atEnd}
            aria-label="Next image"
            className={cn(arrowBase, "right-4", atEnd ? "cursor-not-allowed opacity-0" : "hover:bg-bone")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}

      <motion.div
        key={active}
        drag={zoomed ? true : count > 1 ? "x" : false}
        dragConstraints={zoomed ? stageRef : undefined}
        dragElastic={zoomed ? 0.05 : reduce ? 0 : 0.12}
        dragMomentum={false}
        onPointerDown={() => {
          draggingRef.current = false;
        }}
        onDragStart={() => {
          draggingRef.current = true;
        }}
        onDragEnd={onDragEnd}
        onClick={() => {
          if (draggingRef.current) return;
          setZoomed((z) => !z);
        }}
        style={{ x, y, scale }}
        className={cn("flex", zoomed ? "cursor-zoom-out" : "cursor-zoom-in")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={alt}
          draggable={false}
          className="max-h-[86vh] max-w-[92vw] select-none object-contain"
        />
      </motion.div>

      {count > 1 && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-sans text-sm tracking-wide text-bone/80">
          {active + 1} / {count}
        </div>
      )}
    </motion.div>,
    document.body,
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
  const [zoomOpen, setZoomOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  // read the latest zoom state inside the (stable) key handler without re-binding
  const zoomOpenRef = useRef(false);
  zoomOpenRef.current = zoomOpen;

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
    setZoomOpen(false);
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Escape closes the lightbox first (if open), otherwise the modal.
        if (zoomOpenRef.current) setZoomOpen(false);
        else onClose();
      } else if (e.key === "ArrowLeft") step(-1);
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

  return (
    <>
      {createPortal(
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
                onOpenZoom={() => setZoomOpen(true)}
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
                  <p className="cana-carved font-serif text-xl italic leading-snug text-espresso/85">
                    &ldquo;{product.verse}&rdquo;
                    {product.reference ? (
                      <span className="mt-1 block font-sans text-xs not-italic uppercase tracking-wide2 text-oliveink">
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
                  <span className="font-sans text-[0.7rem] uppercase tracking-wide2 text-oliveink">
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
                      trackName={product.name}
                    />
                  ) : null}
                </div>

                {/* reassurance right at the point of purchase */}
                <ul className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-espresso/70">
                  {[
                    "Ships in 6–8 weeks",
                    "Gift-ready in a bone box",
                    "Secure, encrypted checkout",
                    "Full refund if undeliverable",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <span aria-hidden className="text-olive">
                        ✓
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Rendered without AnimatePresence: it portals to <body>, and an
          AnimatePresence wrapped around a portaled child never completes its
          exit — which left the overlay mounted and froze the page. It fades in
          via its own initial/animate and unmounts cleanly on close. */}
      {product && zoomOpen && (
        <Lightbox
          images={gallery}
          active={active}
          setActive={setActive}
          alt={product.alt}
          name={product.name}
          reduce={reduce}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </>
  );
}
