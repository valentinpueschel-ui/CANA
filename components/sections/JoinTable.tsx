"use client";

import { useState } from "react";
import { Section } from "../Section";
import { Sprig } from "../Sprig";

export function JoinTable() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder: the owner connects this to Mailchimp/Resend.
    // For now we acknowledge gracefully without a backend.
    if (!email) return;
    setDone(true);
  }

  return (
    <Section id="join" labelledBy="join-heading" className="bg-linen">
      <div className="mx-auto max-w-xl text-center">
        <Sprig className="mx-auto h-5 w-16 text-olive/70" />
        <h2
          id="join-heading"
          className="mt-6 font-serif text-h2 font-medium text-umber"
        >
          Join the first table
        </h2>
        <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-espresso/80">
          Be the first to know when new pieces arrive — and receive a founding
          discount on your first order.
        </p>

        {done ? (
          <p
            role="status"
            className="mt-9 font-serif text-xl italic text-umber"
          >
            Thank you — you&rsquo;re on the list. We&rsquo;ll be in touch soon.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-[48px] flex-1 rounded-md border border-umber/25 bg-bone px-4 font-sans text-espresso placeholder:text-espresso/45 focus:border-olive"
            />
            <button
              type="submit"
              className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-umber px-7 font-sans font-medium text-bone transition-colors hover:bg-espresso"
            >
              Join us
            </button>
          </form>
        )}

        <p className="mt-5 font-sans text-sm leading-relaxed text-espresso/55">
          No noise. Just the occasional note and the things worth knowing.
        </p>
      </div>
    </Section>
  );
}
