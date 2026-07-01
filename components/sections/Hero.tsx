import Image from "next/image";
import { LinkButton } from "../Button";
import { Container } from "../Container";

/** Shared hero copy + CTAs, reused by the mobile and desktop layouts. */
function HeroText() {
  return (
    <div className="max-w-md lg:max-w-lg">
      <p className="font-sans text-[0.72rem] uppercase tracking-wide2 text-olive">
        A limited founding batch
      </p>

      <h1 className="mt-5 font-serif text-[clamp(2.75rem,6.5vw,4.5rem)] font-medium leading-[1.05] text-umber">
        The first Cana collection
      </h1>

      <p className="mt-6 max-w-md font-sans text-[1.05rem] leading-relaxed text-espresso/90">
        Scripture, carved into the clay — heirloom pieces for the Christian
        home. Reserve yours now; the founding batch ships in 6–8 weeks.
      </p>

      <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <LinkButton href="#pieces" variant="primary">
          Reserve your piece
        </LinkButton>
        <a
          href="#pieces"
          className="inline-flex min-h-[44px] items-center font-sans text-base font-medium tracking-wide text-umber underline-offset-4 hover:underline"
        >
          See the collection →
        </a>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Cana — the first collection"
      className="relative isolate overflow-hidden bg-bone"
    >
      {/* ── MOBILE (< sm): stacked — copy on bone up top, then the photo as a
             square band below. A square crop is wide enough to hold the whole
             trio (mug / dish / luminary), centered rather than cut off. ── */}
      <div className="flex flex-col sm:hidden">
        <div className="px-6 pb-12 pt-[104px]">
          <HeroText />
        </div>
        <div className="relative aspect-square w-full">
          {/* Square crop pinned to the right (object-x 100%) trims the empty
              curtain on the left, pulling the mug / dish / luminary trio
              toward the centre-left of the frame. */}
          <Image
            src="/images/hero.png"
            alt="A warm morning tablescape in soft natural light — Cana stoneware resting on a linen-draped table."
            fill
            priority
            sizes="100vw"
            className="object-cover object-[100%_center]"
          />
          {/* gentle top feather so the photo melts out of the bone above it */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-bone to-transparent"
          />
        </div>
      </div>

      {/* ── DESKTOP (≥ sm): the original full-bleed overlay hero, unchanged. ── */}
      <div className="relative hidden min-h-[88svh] items-center pt-[72px] sm:flex">
        {/* full-bleed warm morning tablescape (empty space sits to the left) */}
        <Image
          src="/images/hero.png"
          alt="A warm morning tablescape in soft natural light — Cana stoneware resting on a linen-draped table, with calm open space to the left."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />

        {/* Warm scrim behind the text only: bone fading left-to-right into
            transparent. It lightens (never darkens) the photo, so the dark umber
            text stays fully legible while the right side keeps its glow. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,#F4EDDE_0%,rgba(244,237,222,0.96)_32%,rgba(244,237,222,0.62)_52%,rgba(244,237,222,0)_68%)]"
        />

        {/* content — anchored to the left third */}
        <Container className="relative z-10">
          <HeroText />
        </Container>
      </div>
    </section>
  );
}
