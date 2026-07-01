"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/products";
import { Photo } from "./Photo";
import { ShopifyBuyButton } from "./ShopifyBuyButton";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;
// `iframe` is included so the Shopify buy button (rendered in an iframe) stays
// reachable inside the focus trap.
const FOCUSABLE =
  'a[href], button:not([disabled]), input, iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Centered quick-view modal: image gallery (main image + thumbnail row, swipeable
 * on mobile) plus the product details and the Pre-order link. Closes via the X
 * button, Escape, or a click on the backdrop. Traps focus while open, locks body
 * scroll, and restores focus to the trigger on close.
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
  const touchX = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  // Open/close side effects: remember the trigger, lock scroll, focus the close
  // button, listen for Escape — then undo it all (incl. restoring focus) on close.
  useEffect(() => {
    if (!product) return;

    setActive(0);
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreRef.current?.focus?.();
    };
  }, [product, onClose]);

  const gallery = product?.gallery ?? [];

  const step = useCallback(
    (dir: number) => {
      if (gallery.length < 2) return;
      setActive((i) => (i + dir + gallery.length) % gallery.length);
    },
    [gallery.length],
  );

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

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    touchX.current = null;
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
              {/* gallery */}
              <div className="bg-linen p-4 sm:p-6">
                <div
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  className="touch-pan-y select-none"
                >
                  <Photo
                    key={gallery[active]}
                    src={gallery[active]}
                    alt={product.alt}
                    label={product.name}
                    sizes="(max-width: 768px) 92vw, 45vw"
                    className="aspect-square w-full rounded-sm"
                    priority
                  />
                </div>

                {gallery.length > 1 && (
                  <div
                    role="group"
                    aria-label={`${product.name} images`}
                    className="mt-3 flex gap-3 overflow-x-auto pb-1"
                  >
                    {gallery.map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={`Show image ${i + 1} of ${gallery.length}`}
                        aria-current={i === active}
                        className={cn(
                          "relative h-16 w-16 shrink-0 overflow-hidden rounded-sm ring-1 ring-umber/15 transition",
                          i === active
                            ? "ring-2 ring-olive"
                            : "opacity-80 hover:opacity-100",
                        )}
                      >
                        <Photo src={src} alt="" className="h-16 w-16" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
