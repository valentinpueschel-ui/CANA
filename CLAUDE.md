# CLAUDE.md — Cana website project

You are helping build the **Cana** website. Read this fully before writing code. Two skills in `.claude/skills/` extend you here: **cana-brand** (the visual system — use it for every styling decision) and **frontend-design** (how to build a premium, non-generic frontend). The real words and products live in `content/`.

## What Cana is
A premium direct-to-consumer Christian ceramics brand. Heirloom stoneware with a line of Scripture **carved into the clay** (never printed). Tagline: *"Treasure in jars of clay."* Descriptor: *"Heirloom ceramics for the Christian home."* Customer: affluent Protestant women ~55–75 in North America who buy gifts often.

## What we're building (v1)
A **founding-batch pre-order site** — a polished one-page (multi-section) marketing + pre-order page. Customers reserve and pay now; pieces ship in 6–8 weeks. This is a validation launch, so the priorities are: looks expensive, loads fast, works perfectly on mobile, and makes pre-ordering effortless.

This is NOT a full store with inventory/cart logic. Each product's "Pre-order" button links to a **Stripe Payment Link** (the owner will paste real links; use clearly-labeled placeholders like `STRIPE_LINK_GIFTSET`).

## Tech stack
- **Next.js (App Router) + TypeScript + Tailwind CSS.**
- Fonts via `next/font/google`: **Cormorant Garamond** (headings/verses) + **Work Sans** (body).
- Animations: **Framer Motion**, used sparingly (gentle fades/reveals only).
- Images: `next/image`, served from `/public/images/` (owner adds the real photos; use the filenames listed in `content/products.md`).
- No backend, no database, no auth. Email signup posts to a placeholder endpoint or an embeddable form (owner will connect Mailchimp/Resend).
- Deploy target: **GitHub → Vercel** (see BUILD.md).

## Page sections (in order)
1. Sticky header — CANA wordmark, nav (The Pieces / Our Story / Pre-order), small "Reserve" button.
2. Hero — warm full-bleed image, headline, founding-batch subhead, primary CTA.
3. Our Story — short, warm (the wedding at Cana; carved not printed; made to be kept).
4. The Pieces — product grid, **gift set first**; each card: image, name, verse + reference, one line, price, "Pre-order" → Stripe link.
5. Why a Founding Batch — limited first run, hand-carved, ships 6–8 weeks, gift-ready, secure Stripe checkout, refund if undeliverable.
6. The Blessing Card — the carded verse + reflection that ships with each piece.
7. Join the First Table — email capture.
8. FAQ — shipping/timing, returns, materials/care, "is it really carved?"
9. Footer — coin mark, Instagram + Facebook, contact email.

Use the exact copy in `content/site-copy.md` and product data in `content/products.md`. Don't invent verses or change references — accuracy matters to this audience.

## Hard rules (non-negotiable)
- **Never** use wine, alcohol, or grape imagery anywhere.
- **Never** put a printed logo on the product imagery's front face (the products are carved; the brand mark lives on the base/packaging).
- No "blessed beyond measure" clichés, no countdown timers, no urgency-spam, no loud sale banners.
- Accessibility: semantic HTML, alt text on every image, AA contrast, keyboard-navigable.
- Performance: optimized images, minimal JS, fast LCP. This must feel calm and instant.

## How to work
1. Scaffold the Next.js app, wire Tailwind to the cana-brand tokens (see the skill), load the fonts.
2. Build section by section, top to bottom. After each, summarize what you did and pause for review.
3. Apply the **frontend-design** skill's principles to every section (whitespace, hierarchy, restraint).
4. Use placeholder image filenames from `content/products.md`; the owner drops real photos in `/public/images/`.
5. Keep components small and reusable (`Section`, `ProductCard`, `Button`, `Nav`, `Footer`).
6. When unsure about a visual choice, prefer **more restraint and more whitespace** — Cana is quiet luxury.
