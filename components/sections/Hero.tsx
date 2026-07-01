import Image from "next/image";
import { LinkButton } from "../Button";
import { Container } from "../Container";

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Cana — the first collection"
      className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-bone pt-[72px]"
    >
      {/* full-bleed warm morning tablescape (empty space sits to the left) */}
      <Image
        src="/images/hero.png"
        alt="A warm morning tablescape in soft natural light — Cana stoneware resting on a linen-draped table, with calm open space to the left."
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />

      {/* Warm scrim behind the text only: bone fading left-to-right into transparent.
          It lightens (never darkens) the photo, so the dark umber text stays fully
          legible while the right side keeps its glow.
          Mobile: a wider, stronger bone wash so the left-aligned text reads at 375px. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,#F4EDDE_0%,#F4EDDE_60%,rgba(244,237,222,0.7)_84%,rgba(244,237,222,0)_100%)] sm:bg-[linear-gradient(to_right,#F4EDDE_0%,rgba(244,237,222,0.96)_32%,rgba(244,237,222,0.62)_52%,rgba(244,237,222,0)_68%)]"
      />

      {/* content — anchored to the left third */}
      <Container className="relative z-10">
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
      </Container>
    </section>
  );
}
