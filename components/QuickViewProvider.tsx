"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Product } from "@/lib/products";
import { QuickView } from "./QuickView";
import { track } from "@/lib/analytics";

type QuickViewContextValue = { open: (product: Product) => void };

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function useQuickView(): QuickViewContextValue {
  const ctx = useContext(QuickViewContext);
  if (!ctx) {
    throw new Error("useQuickView must be used within a <QuickViewProvider>");
  }
  return ctx;
}

/**
 * Holds the single quick-view modal for the page. Any descendant card can call
 * open(product) to show it. Keeping one instance keeps focus-trapping, scroll
 * locking and the backdrop in one place.
 */
export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  const open = useCallback((p: Product) => {
    setProduct(p);
    track("ViewContent", {
      content_name: p.name,
      content_type: "product",
      value: Number(p.price.replace(/[^0-9.]/g, "")) || undefined,
      currency: "USD",
    });
  }, []);
  const close = useCallback(() => setProduct(null), []);

  return (
    <QuickViewContext.Provider value={{ open }}>
      {children}
      <QuickView product={product} onClose={close} />
    </QuickViewContext.Provider>
  );
}
