"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

const SCRIPT_URL =
  "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
const DOMAIN = "pe4fjn-i9.myshopify.com";
const STOREFRONT_ACCESS_TOKEN = "e16a8ba4b18d3accb3f21984fd0164e9";

const UMBER = "#54442f";
const UMBER_HOVER = "#4c3d2a";

type ShopifyUI = {
  createComponent: (type: string, config: Record<string, unknown>) => void;
};
type ShopifyBuyGlobal = {
  buildClient: (cfg: {
    domain: string;
    storefrontAccessToken: string;
  }) => unknown;
  UI: { onReady: (client: unknown) => Promise<ShopifyUI> };
};

function getShopifyBuy(): ShopifyBuyGlobal | undefined {
  return (window as unknown as { ShopifyBuy?: ShopifyBuyGlobal }).ShopifyBuy;
}

// Inject the Buy SDK <script> exactly once for the whole page. If window.ShopifyBuy
// already exists (or a load is already in flight), reuse it — never re-inject.
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
      // Script tag already present — attach to it instead of adding another.
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

// Build the client + UI once and share it across every button instance, so each
// instance only has to call ui.createComponent for its own node.
let uiPromise: Promise<ShopifyUI> | null = null;
function getUI(): Promise<ShopifyUI> {
  if (!uiPromise) {
    uiPromise = loadSdk().then((sb) =>
      sb.UI.onReady(
        sb.buildClient({
          domain: DOMAIN,
          storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
        }),
      ),
    );
  }
  return uiPromise;
}

// Hide the SDK's image/title/price/options (we render those ourselves); show only
// the button, in Cana umber. Cart + toggle get the same umber treatment.
function buildOptions(buttonText: string) {
  const button = {
    "font-family": "var(--font-sans), sans-serif",
    "background-color": UMBER,
    ":hover": { "background-color": UMBER_HOVER },
    ":focus": { "background-color": UMBER_HOVER },
    "border-radius": "40px",
  };
  const contents = {
    img: false,
    title: false,
    price: false,
    options: false,
    button: true,
  };
  return {
    product: {
      contents,
      buttonDestination: "checkout",
      text: { button: buttonText },
      styles: { button },
    },
    // shown only if a product ever opens in a modal (buttonDestination: 'modal')
    modalProduct: {
      contents,
      text: { button: buttonText },
      styles: { button },
    },
    cart: { styles: { button } },
    toggle: {
      styles: {
        toggle: {
          "background-color": UMBER,
          ":hover": { "background-color": UMBER_HOVER },
          ":focus": { "background-color": UMBER_HOVER },
        },
      },
    },
  };
}

/**
 * A reusable Shopify buy button. Pass the Shopify `productId` and a unique `domId`
 * (the SDK mounts into `<div id={domId} />`). The Buy SDK script is injected only
 * once for the page and the client is shared — every instance just creates its own
 * product component against its own div.
 */
export function ShopifyBuyButton({
  productId,
  domId,
  buttonText = "Pre-order",
  className,
}: {
  productId: string;
  domId: string;
  buttonText?: string;
  className?: string;
}) {
  useEffect(() => {
    let cancelled = false;

    getUI()
      .then((ui) => {
        if (cancelled) return;
        const node = document.getElementById(domId);
        if (!node) return;
        node.innerHTML = ""; // guard against a double render (StrictMode / re-mount)
        ui.createComponent("product", {
          id: productId,
          node,
          options: buildOptions(buttonText),
        });
      })
      .catch(() => {
        /* network / SDK failure — the button just won't appear */
      });

    return () => {
      cancelled = true;
      const node = document.getElementById(domId);
      if (node) node.innerHTML = "";
    };
  }, [productId, domId, buttonText]);

  return <div id={domId} className={cn("min-h-[44px]", className)} />;
}
