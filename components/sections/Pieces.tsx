import { Section, SectionHeading } from "../Section";
import { Reveal } from "../Reveal";
import { Photo } from "../Photo";
import { ProductCard } from "../ProductCard";
import { QuickViewProvider } from "../QuickViewProvider";
import { products } from "@/lib/products";

export function Pieces() {
  const [lead, ...rest] = products;

  return (
    <Section labelledBy="pieces-heading" className="bg-bone">
      {/* the craft — a purposeful opener: carved into the clay, made to be held.
          A near-square crop centered on the mug (object-center) keeps the verse
          and hands in frame with just a little linen/olive around it; items-center
          vertically centers the shorter text block alongside it. */}
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* image — stacks on top on mobile, sits left on desktop */}
        <Reveal>
          <Photo
            src="/images/hands.webp"
            alt="Two hands cradling a warm ivory Cana piece in soft natural light, a thumb resting on the verse carved into the clay."
            label="Made to be held"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-square w-full"
            imgClassName="object-center"
          />
        </Reveal>

        {/* text */}
        <Reveal delay={0.05} className="max-w-xl">
          <span aria-hidden className="block h-px w-12 bg-gold/70" />
          <p className="mt-5 font-sans text-[0.72rem] uppercase tracking-wide2 text-oliveink">
            The craft
          </p>
          <h2 className="mt-4 font-serif text-h2 font-medium text-umber">
            Made to be held.
          </h2>
          <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-espresso/85">
            Every verse is carved into the clay itself — something you can run
            your thumb across, hold in your hands, and one day hand to someone
            you love.
          </p>
        </Reveal>
      </div>

      {/* the collection — the scroll target for the hero CTAs and the
          "The Pieces" / "Pre-order" nav links (lands on the product grid) */}
      <div id="pieces" className="mt-20 lg:mt-28">
        <SectionHeading
          id="pieces-heading"
          eyebrow="The collection"
          title="The collection"
          intro="Four pieces to begin. Each carries one verse, carved by hand, tone on tone."
        />

        {/* cards open a shared quick-view modal (no separate product pages) */}
        <QuickViewProvider>
          {/* lead product — full-width editorial card */}
          <Reveal className="mt-14">
            <ProductCard product={lead} featured />
          </Reveal>

          {/* the remaining three */}
          <ul className="mt-8 grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        </QuickViewProvider>
      </div>
    </Section>
  );
}
