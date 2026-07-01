import Image from "next/image";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="bg-linen">
      <Container className="py-16 sm:py-20">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* logo.png is a square cream tile with the round coin centered (~56% wide).
              Clip to a circle and zoom to the coin so only the round mark shows —
              no square corners or cream halo against the linen footer. */}
          <div className="h-24 w-24 overflow-hidden rounded-full">
            <Image
              src="/images/logo.png"
              alt="Cana · Galilee coin mark"
              width={96}
              height={96}
              className="h-full w-full scale-[1.75] object-cover"
            />
          </div>

          <p className="font-serif text-xl italic text-umber">
            Heirloom ceramics for the Christian home.
          </p>

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center px-2 font-sans text-sm tracking-wide text-espresso/80 transition-colors hover:text-olive"
            >
              Instagram
            </a>
            <span aria-hidden className="text-olive/40">
              ·
            </span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center px-2 font-sans text-sm tracking-wide text-espresso/80 transition-colors hover:text-olive"
            >
              Facebook
            </a>
            <span aria-hidden className="text-olive/40">
              ·
            </span>
            <a
              href="mailto:hello@canaceramics.com"
              className="inline-flex min-h-[44px] items-center px-2 font-sans text-sm tracking-wide text-espresso/80 transition-colors hover:text-olive"
            >
              hello@canaceramics.com
            </a>
          </nav>

          <div className="mt-2 border-t border-umber/10 pt-8">
            <p className="font-sans text-sm leading-relaxed text-espresso/70">
              © {new Date().getFullYear()} Cana. Treasure in jars of clay.{" "}
              <span className="text-espresso/40">(2 Corinthians 4:7)</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
