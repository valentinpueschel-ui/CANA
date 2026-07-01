import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { Photo } from "../Photo";
import { Sprig } from "../Sprig";

export function BlessingCard() {
  return (
    <Section id="blessing" labelledBy="blessing-heading" className="bg-bone">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* text first on desktop, image below on mobile */}
        <Reveal className="order-2 max-w-xl lg:order-1">
          <span aria-hidden className="block h-px w-12 bg-gold/70" />
          <p className="mt-5 font-sans text-[0.72rem] uppercase tracking-wide2 text-olive">
            In every box
          </p>
          <h2
            id="blessing-heading"
            className="mt-4 font-serif text-h2 font-medium text-umber"
          >
            A blessing, in the box
          </h2>
          <p className="mt-6 font-sans text-[1.05rem] leading-relaxed text-espresso/85">
            Every Cana piece ships with a small blessing card — the verse on one
            side, and a few quiet lines on what it means on the other. So the
            gift arrives already carrying its words.
          </p>
          <Sprig className="mt-8 h-5 w-20 text-olive/70" />
        </Reveal>

        <Reveal delay={0.05} className="order-1 lg:order-2">
          <Photo
            src="/images/mug-card.jpeg"
            alt="A Cana blessing card resting on linen — the verse on one side, a short reflection on the other."
            label="A blessing, in the box"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[5/4] w-full"
          />
        </Reveal>
      </div>
    </Section>
  );
}
