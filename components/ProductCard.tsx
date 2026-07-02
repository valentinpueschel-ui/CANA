"use client";

import type { Product } from "@/lib/products";
import { Photo } from "./Photo";
import { useQuickView } from "./QuickViewProvider";
import { ShopifyBuyButton } from "./ShopifyBuyButton";

const imgHover =
  "rounded-none transition-transform duration-500 ease-out group-hover:scale-[1.03]";

/** A quiet "tap to open the quick view" cue, in place of a direct CTA. */
function ViewCue() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center gap-1 font-sans text-sm font-medium tracking-wide text-umber underline-offset-4 group-hover:underline"
    >
      View details
      <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
        &rarr;
      </span>
    </span>
  );
}

/**
 * The card's purchase action. If the product has a Shopify buy button, show it
 * (raised above the card's quick-view overlay with z-20 so it's directly
 * clickable); otherwise the quiet "View details" cue that opens the quick view.
 */
function CardAction({ product }: { product: Product }) {
  if (product.shopifyId && product.shopifyDomId) {
    return (
      <ShopifyBuyButton
        productId={product.shopifyId}
        domId={product.shopifyDomId}
        trackName={product.name}
        className="relative z-20"
      />
    );
  }
  return <ViewCue />;
}

export function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const { open } = useQuickView();

  // A transparent overlay button makes the whole card the trigger without
  // nesting interactive content inside another control.
  const Trigger = (
    <button
      type="button"
      onClick={() => open(product)}
      aria-label={`Quick view: ${product.name}`}
      aria-haspopup="dialog"
      className="absolute inset-0 z-10 rounded-md"
    />
  );

  if (featured) {
    return (
      <article className="group relative grid overflow-hidden rounded-md bg-linen md:grid-cols-2">
        <Photo
          src={product.image}
          alt={product.alt}
          label={product.name}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-[420px]"
          imgClassName={imgHover}
        />
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-10 lg:p-14">
          <span className="font-sans text-[0.7rem] uppercase tracking-wide2 text-oliveink">
            The founding gift
          </span>
          <h3 className="font-serif text-h3 font-medium text-umber">
            {product.name}
          </h3>
          <p className="font-serif text-xl italic text-espresso/70">
            {product.shortLine}
          </p>
          <p className="max-w-md font-sans leading-relaxed text-espresso/80">
            {product.description}
          </p>
          <div className="mt-2 flex items-center gap-5">
            <span className="font-serif text-2xl text-umber">
              {product.price}
            </span>
            <CardAction product={product} />
          </div>
        </div>
        {Trigger}
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md bg-linen ring-1 ring-transparent transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_44px_-26px_rgba(58,46,32,0.55)] hover:ring-gold/40">
      <Photo
        src={product.image}
        alt={product.alt}
        label={product.name}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-[4/5] w-full"
        imgClassName={imgHover}
      />
      <div className="flex flex-1 flex-col gap-3 p-7">
        <h3 className="font-serif text-h3 font-medium text-umber">
          {product.name}
        </h3>

        {product.verse ? (
          <p className="cana-carved font-serif text-lg leading-snug text-espresso/85">
            &ldquo;{product.verse}&rdquo;
            <span className="mt-1 block font-sans text-xs uppercase tracking-wide2 text-oliveink">
              {product.reference}
            </span>
          </p>
        ) : null}

        <p className="font-sans text-base leading-relaxed text-espresso/75">
          {product.shortLine}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <span className="font-serif text-xl text-umber">{product.price}</span>
          <CardAction product={product} />
        </div>
      </div>
      {Trigger}
    </article>
  );
}
