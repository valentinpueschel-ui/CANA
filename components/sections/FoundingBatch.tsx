import { Section, SectionHeading } from "../Section";
import { Reveal } from "../Reveal";

const points = [
  {
    title: "Hand-carved, made to be kept.",
    body: "Warm ivory stoneware; the verse pressed into the clay, never a printed decal.",
  },
  {
    title: "Gift-ready.",
    body: "Every piece arrives in a bone gift box with a blessing card, ready to give.",
  },
  {
    title: "Founding price.",
    body: "A thank-you for being among the first to the table.",
  },
  {
    title: "No risk.",
    body: "Secure checkout through Stripe. If for any reason we can't deliver, you're refunded in full.",
  },
];

export function FoundingBatch() {
  return (
    <Section
      id="founding"
      labelledBy="founding-heading"
      className="bg-linen"
    >
      <SectionHeading
        id="founding-heading"
        eyebrow="Made to order"
        title="Why a founding batch"
        intro="This is our very first run, made to order. Reserve a piece now and we craft the batch together — which is why it ships in 6–8 weeks rather than today."
      />

      <ul className="mx-auto mt-14 grid max-w-4xl list-none gap-x-12 gap-y-10 sm:grid-cols-2">
        {points.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 0.05}>
            <div className="flex gap-4">
              <span
                aria-hidden
                className="mt-3 h-px w-6 shrink-0 bg-gold"
              />
              <div>
                <h3 className="font-serif text-xl text-umber">{p.title}</h3>
                <p className="mt-2 font-sans leading-relaxed text-espresso/80">
                  {p.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
