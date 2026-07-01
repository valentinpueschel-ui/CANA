import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { Photo } from "../Photo";
import { Sprig } from "../Sprig";

export function Story() {
  return (
    <Section id="story" labelledBy="story-heading" className="bg-bone">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* image */}
        <Reveal className="order-1 lg:order-none">
          <Photo
            src="/images/stamp.png"
            alt="The Cana · Galilee maker's mark pressed into raw clay — a craft detail of the coin stamp on the base of each piece."
            label="Carved, never printed"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/5] w-full"
          />
        </Reveal>

        {/* text */}
        <Reveal delay={0.05} className="max-w-xl">
          <span aria-hidden className="block h-px w-12 bg-gold/70" />
          <p className="mt-5 font-sans text-[0.72rem] uppercase tracking-wide2 text-olive">
            Our story
          </p>
          <h2
            id="story-heading"
            className="mt-4 font-serif text-h2 font-medium text-umber"
          >
            The everyday, made sacred
          </h2>

          <div className="mt-6 space-y-5 font-sans text-[1.05rem] leading-relaxed text-espresso/85">
            <p>
              It began with a small idea: that the things we reach for every
              morning — the cup, the dish, the table we gather around — are
              quietly holy, and ought to be beautiful enough to keep.
            </p>
            <p>
              So we make heirloom stoneware with a line of Scripture pressed into
              the clay itself. Not printed on. Carved in — something you can run
              your thumb across, hold in your hands, and one day hand to someone
              you love.
            </p>
            <p>
              The name is from the wedding at Cana, where the first miracle turned
              plain water into the finest wine — the ordinary made lovely. That&rsquo;s
              the whole hope of what we make.
            </p>
          </div>

          <Sprig className="mt-8 h-5 w-20 text-olive/70" />
        </Reveal>
      </div>
    </Section>
  );
}
