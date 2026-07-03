"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { openCart, subscribeCartCount } from "./ShopifyBuyButton";

/**
 * The header cart. Opens the shared Shopify cart drawer and shows a live item
 * count (kept in sync by the cart controller in ShopifyBuyButton).
 */
export function CartButton({ className }: { className?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => subscribeCartCount(setCount), []);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={
        count > 0
          ? `Open cart, ${count} item${count === 1 ? "" : "s"}`
          : "Open cart"
      }
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center text-umber transition-colors hover:text-olive",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-[22px] w-[22px]"
      >
        {/* soft shopping bag */}
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-umber px-1 font-sans text-[10px] font-medium leading-none text-bone">
          {count}
        </span>
      ) : null}
    </button>
  );
}
