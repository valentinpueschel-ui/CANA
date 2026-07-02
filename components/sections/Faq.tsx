"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section, SectionHeading } from "../Section";

const EASE = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: "When will my order ship?",
    a: "The founding batch is made to order and ships within 6–8 weeks of your reservation. You'll get an email at every step.",
  },
  {
    q: "When am I charged?",
    a: "At reservation — your card is charged now to secure your piece in the founding batch. Reserving now is what lets us make it for you.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes. Checkout is encrypted end to end and handled by our secure payment provider; we never see or store your card details.",
  },
  {
    q: "How will I know it's on the way?",
    a: "We'll email you when your batch goes into production, and again when it ships — with tracking so you can follow it to the door.",
  },
  {
    q: "Is the Scripture really carved, or printed?",
    a: "Carved — pressed into the clay itself, tone on tone, so you can feel the words. No decals, no ink.",
  },
  {
    q: "What is it made of, and how do I care for it?",
    a: "Warm ivory stoneware with a soft matte finish and a raw, unglazed clay foot. Dishwasher-safe; we'd gently hand-wash to keep it lovely for years.",
  },
  {
    q: "Can I send it straight to someone as a gift?",
    a: "Yes. Every piece comes gift-ready in a box with a blessing card, and you can ship it directly to them with a note.",
  },
  {
    q: "What if I change my mind?",
    a: "Reach out any time before your batch ships and we'll refund you in full.",
  },
];

function Item({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelId = `faq-panel-${index}`;
  const btnId = `faq-button-${index}`;

  return (
    <div className="border-b border-umber/15">
      <h3>
        <button
          id={btnId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[44px] w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-serif text-lg text-umber sm:text-xl">{q}</span>
          <span
            aria-hidden
            className={`relative h-4 w-4 shrink-0 text-olive transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          >
            <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
            <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-current" />
          </span>
        </button>
      </h3>
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        aria-hidden={!open}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.32, ease: EASE }}
        className="overflow-hidden"
      >
        <p className="max-w-2xl pb-6 pr-4 font-sans leading-relaxed text-espresso/80">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-heading" className="bg-bone">
      <SectionHeading id="faq-heading" eyebrow="Good to know" title="Questions" />
      <div className="mx-auto mt-12 max-w-2xl">
        {faqs.map((f, i) => (
          <Item key={f.q} q={f.q} a={f.a} index={i} />
        ))}
      </div>
    </Section>
  );
}
