"use client";

import { useState } from "react";
import { Section } from "../Section";
import { DrawnSprig } from "../DrawnSprig";
import { track } from "@/lib/analytics";

type Status = "idle" | "loading" | "done" | "error";

// Set NEXT_PUBLIC_NEWSLETTER_ENDPOINT to a hosted form/ESP URL (Mailchimp,
// Resend, Formspree, etc.) that accepts a POST { email }.
const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

export function JoinTable() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error(`Signup failed (${res.status})`);
      }
      // No endpoint configured yet: still acknowledge so the UX isn't broken in
      // preview, but the address is only persisted once ENDPOINT is set.
      setStatus("done");
      track("Lead", { content_name: "newsletter" });
    } catch {
      setStatus("error");
    }
  }

  const done = status === "done";

  return (
    <Section id="join" labelledBy="join-heading" className="bg-linen">
      <div className="mx-auto max-w-xl text-center">
        <DrawnSprig className="mx-auto h-5 w-16 text-olive/70" />
        <h2
          id="join-heading"
          className="mt-6 font-serif text-h2 font-medium text-umber"
        >
          Join the first table
        </h2>
        <p className="mt-5 font-sans text-[1.05rem] leading-relaxed text-espresso/85">
          Be the first to know when new pieces arrive — and receive a founding
          discount on your first order.
        </p>

        {done ? (
          <p role="status" className="mt-9 font-serif text-xl italic text-umber">
            Thank you — you&rsquo;re on the list. We&rsquo;ll be in touch soon.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1 text-left">
              <label
                htmlFor="email"
                className="mb-1 block font-sans text-xs uppercase tracking-wide2 text-oliveink"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby={status === "error" ? "email-error" : undefined}
                className="min-h-[48px] w-full rounded-md border border-umber/30 bg-bone px-4 font-sans text-espresso placeholder:text-espresso/70 focus:border-olive"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex min-h-[48px] items-center justify-center self-end rounded-md bg-umber px-7 font-sans font-medium text-bone transition-colors hover:bg-espresso disabled:opacity-70"
            >
              {status === "loading" ? "Joining…" : "Join us"}
            </button>
          </form>
        )}

        {status === "error" ? (
          <p
            id="email-error"
            role="alert"
            className="mt-4 font-sans text-sm text-terra"
          >
            Something went wrong — please try again, or email
            hello@canaceramics.com.
          </p>
        ) : null}

        <p className="mt-5 font-sans text-sm leading-relaxed text-espresso/75">
          No noise. Just the occasional note and the things worth knowing.
        </p>
      </div>
    </Section>
  );
}
