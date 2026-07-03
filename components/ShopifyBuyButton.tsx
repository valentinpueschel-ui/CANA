"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

const SCRIPT_URL =
  "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
const DOMAIN = "pe4fjn-i9.myshopify.com";
const STOREFRONT_ACCESS_TOKEN = "e16a8ba4b18d3accb3f21984fd0164e9";

const UMBER = "#54442f";
const UMBER_HOVER = "#4c3d2a";

/* ── SDK types (loose — the SDK is loaded at runtime from the CDN) ───────── */
type ShopifyComponent = { destroy?: () => void };
type ShopifyVariant = unknown;
type ShopifyProduct = ShopifyComponent & {
  id?: string;
  selectedVariant?: ShopifyVariant;
  cart?: ShopifyCart;
};
type ShopifyCart = {
  open?: () => void;
  close?: () => void;
  addVariantToCart?: (variant: ShopifyVariant, quantity: number) => void;
  model?: { lineItems?: { quantity?: number }[] };
};
type ShopifyUI = {
  createComponent: (
    type: string,
    config: Record<string, unknown>,
  ) => ShopifyComponent | Promise<ShopifyComponent>;
  components?: { cart?: ShopifyCart[]; product?: ShopifyProduct[] };
};
type ShopifyBuyGlobal = {
  buildClient: (cfg: { domain: string; storefrontAccessToken: string }) => unknown;
  UI: { onReady: (client: unknown) => Promise<ShopifyUI> };
};

function getShopifyBuy(): ShopifyBuyGlobal | undefined {
  return (window as unknown as { ShopifyBuy?: ShopifyBuyGlobal }).ShopifyBuy;
}

// Inject the Buy SDK <script> exactly once for the whole page.
let sdkPromise: Promise<ShopifyBuyGlobal> | null = null;
function loadSdk(): Promise<ShopifyBuyGlobal> {
  const ready = getShopifyBuy();
  if (ready?.UI) return Promise.resolve(ready);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<ShopifyBuyGlobal>((resolve, reject) => {
    const settle = () => {
      const sb = getShopifyBuy();
      if (sb?.UI) resolve(sb);
      else reject(new Error("Shopify Buy SDK loaded without UI"));
    };
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_URL}"]`,
    );
    if (existing) {
      existing.addEventListener("load", settle);
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Shopify Buy SDK")),
      );
      if (getShopifyBuy()?.UI) settle();
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = SCRIPT_URL;
    script.addEventListener("load", settle);
    script.addEventListener("error", () =>
      reject(new Error("Failed to load Shopify Buy SDK")),
    );
    (document.head || document.body).appendChild(script);
  });
  return sdkPromise;
}

// Build the client + UI once and share it across every instance.
let uiRef: ShopifyUI | null = null;
let uiPromise: Promise<ShopifyUI> | null = null;
function getUI(): Promise<ShopifyUI> {
  if (!uiPromise) {
    uiPromise = loadSdk()
      .then((sb) =>
        sb.UI.onReady(
          sb.buildClient({
            domain: DOMAIN,
            storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
          }),
        ),
      )
      .then((ui) => {
        uiRef = ui;
        return ui;
      });
  }
  return uiPromise;
}

/* ── Shared cart controller (drives the header cart button) ─────────────── */
function getCart(): ShopifyCart | null {
  return uiRef?.components?.cart?.[0] ?? null;
}
export function cartItemCount(): number {
  const items = getCart()?.model?.lineItems ?? [];
  return items.reduce((n, li) => n + (li.quantity || 0), 0);
}
export function openCart(): void {
  // Defer past the triggering click: the SDK cart closes on outside-clicks, so
  // opening synchronously inside that click gets undone by the same event.
  const c = getCart();
  setTimeout(() => c?.open?.(), 0);
}
const countListeners = new Set<(n: number) => void>();
let pollTimer: ReturnType<typeof setInterval> | null = null;
function notifyCount(): void {
  const n = cartItemCount();
  countListeners.forEach((cb) => cb(n));
}
/** Subscribe to the live cart quantity. Polls as a robust catch-all for adds,
 *  removals and in-drawer quantity edits (the SDK has no single change event). */
export function subscribeCartCount(cb: (n: number) => void): () => void {
  countListeners.add(cb);
  cb(cartItemCount());
  if (!pollTimer) pollTimer = setInterval(notifyCount, 1200);
  return () => {
    countListeners.delete(cb);
    if (countListeners.size === 0 && pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };
}

/* ── Shared style + option builders ─────────────────────────────────────── */
const umberButton = {
  "font-family": "var(--font-sans), sans-serif",
  "background-color": UMBER,
  ":hover": { "background-color": UMBER_HOVER },
  ":focus": { "background-color": UMBER_HOVER },
  "border-radius": "6px",
};

function cartAndToggle(trackName?: string) {
  return {
    cart: {
      startOpen: false,
      popup: false,
      styles: { button: umberButton },
      text: {
        title: "Your cart",
        button: "Checkout",
        total: "Subtotal",
        notice: "Founding batch — ships in 6–8 weeks.",
      },
      events: { openCheckout: () => track("InitiateCheckout") },
    },
    toggle: {
      styles: {
        toggle: {
          "font-family": "var(--font-sans), sans-serif",
          "background-color": UMBER,
          ":hover": { "background-color": UMBER_HOVER },
          ":focus": { "background-color": UMBER_HOVER },
        },
      },
    },
    _trackName: trackName, // (unused by SDK; kept for readability)
  };
}

// Options for the simple card button (adds a single unit to the shared cart).
function cardOptions(buttonText: string, trackName?: string) {
  return {
    product: {
      contents: { img: false, title: false, price: false, options: false, button: true },
      buttonDestination: "cart",
      text: { button: buttonText },
      styles: { button: umberButton },
      events: {
        addVariantToCart: () => {
          track(
            "AddToCart",
            trackName ? { content_name: trackName, content_type: "product" } : undefined,
          );
          notifyCount();
        },
      },
    },
    ...cartAndToggle(trackName),
  };
}

/**
 * Simple "Add to cart" button used on the product cards — the Shopify SDK button,
 * styled umber, adding one unit to the shared cart drawer.
 */
export function ShopifyBuyButton({
  productId,
  domId,
  buttonText = "Add to cart",
  trackName,
  className,
}: {
  productId: string;
  domId: string;
  buttonText?: string;
  trackName?: string;
  className?: string;
}) {
  useEffect(() => {
    let cancelled = false;
    let component: ShopifyComponent | null = null;

    getUI()
      .then((ui) => {
        if (cancelled) return;
        const node = document.getElementById(domId);
        if (!node) return;
        node.innerHTML = "";
        return Promise.resolve(
          ui.createComponent("product", {
            id: productId,
            node,
            options: cardOptions(buttonText, trackName),
          }),
        ).then((c) => {
          if (cancelled) c?.destroy?.();
          else component = c;
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (component?.destroy) component.destroy();
      else {
        const node = document.getElementById(domId);
        if (node) node.innerHTML = "";
      }
    };
  }, [productId, domId, buttonText, trackName]);

  return <div id={domId} className={cn("min-h-[44px]", className)} />;
}

/* ── Custom, brand-styled quantity stepper ──────────────────────────────── */
function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const btn =
    "flex h-11 w-11 items-center justify-center text-umber transition-colors hover:text-espresso disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="inline-flex items-center rounded-full border border-umber/25 bg-bone">
      <button
        type="button"
        className={btn}
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 12h14" />
        </svg>
      </button>
      <span
        aria-live="polite"
        className="min-w-[1.75rem] text-center font-serif text-lg tabular-nums text-umber"
      >
        {value}
      </span>
      <button
        type="button"
        className={btn}
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(99, value + 1))}
        disabled={value >= 99}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}

/**
 * The quick-view purchase control: a custom quantity stepper + "Add to cart"
 * button. A hidden Shopify product component is created only to obtain the
 * variant + shared cart; the button adds the chosen quantity via the SDK cart
 * API, opens the drawer, fires AddToCart, and calls onAdd (to close the modal).
 */
export function AddToCartControl({
  productId,
  trackName,
  onAdd,
  className,
}: {
  productId: string;
  trackName?: string;
  onAdd?: () => void;
  className?: string;
}) {
  const [qty, setQty] = useState(1);
  const [ready, setReady] = useState(false);
  const productRef = useRef<ShopifyProduct | null>(null);

  // Reuse the (already-created) card product component for this product — it
  // holds the fetched variant + shared cart, so we don't create a duplicate.
  useEffect(() => {
    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | null = null;
    getUI()
      .then((ui) => {
        if (cancelled) return;
        poll = setInterval(() => {
          const prod = (ui.components?.product ?? []).find(
            (pr) => pr.id === productId && pr.selectedVariant,
          );
          if (prod) {
            productRef.current = prod;
            setReady(true);
            if (poll) clearInterval(poll);
          }
        }, 150);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
    };
  }, [productId]);

  const handleAdd = useCallback(() => {
    const comp = productRef.current;
    const variant = comp?.selectedVariant;
    const cart = comp?.cart ?? getCart();
    if (!cart?.addVariantToCart || !variant) return;
    cart.addVariantToCart(variant, qty);
    openCart(); // deferred open (see note in openCart)
    track(
      "AddToCart",
      trackName
        ? { content_name: trackName, content_type: "product", quantity: qty }
        : undefined,
    );
    notifyCount();
    onAdd?.();
  }, [qty, trackName, onAdd]);

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <QuantityStepper value={qty} onChange={setQty} />
      <button
        type="button"
        onClick={handleAdd}
        disabled={!ready}
        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md bg-umber px-7 font-sans font-medium tracking-wide text-bone transition-colors hover:bg-espresso disabled:opacity-60"
      >
        {ready ? "Add to cart" : "Loading…"}
      </button>
    </div>
  );
}
