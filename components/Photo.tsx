"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Sprig } from "./Sprig";

/**
 * A warm, brand-correct image frame.
 * Uses next/image when the real photo exists in /public/images/.
 * Until then it degrades to a calm linen placeholder (sprig + label)
 * so the layout always reads as intentional.
 */
export function Photo({
  src,
  alt,
  label,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  label?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-linen",
        className,
      )}
    >
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imgClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-linen text-umber/55"
          role="img"
          aria-label={alt}
        >
          <Sprig className="h-5 w-16 text-olive/70" />
          {label ? (
            <span className="px-6 text-center font-serif text-lg italic">
              {label}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
