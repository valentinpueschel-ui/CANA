# BUILD.md — from empty folder to a live Cana site

Follow these in order with Claude Code in VS Code. You don't write code; you give instructions, review, and approve.

## 0. Prerequisites (one-time)
- Install **VS Code**, **Node.js (LTS)**, and **Git**.
- Install **Claude Code** and sign in. In the terminal: `claude`.
- Free accounts: **GitHub**, **Vercel**, **Stripe**. (Mailchimp/Resend optional, for the email form.)

## 1. Set up the project
1. Make a folder `cana-site` and copy this whole kit into it (keep `CLAUDE.md` and `.claude/` at the root).
2. Open the folder in VS Code → open the terminal → run `claude`.
3. First prompt to Claude Code:
   > Read CLAUDE.md and the two skills in .claude/skills, plus content/products.md and content/site-copy.md. Then scaffold a Next.js + TypeScript + Tailwind app in this folder, wire the cana-brand color tokens into tailwind.config, load Cormorant Garamond + Work Sans via next/font, and set up reusable Container, Section, and Button components. Don't build sections yet — just the foundation. Then show me how to run the dev server.

## 2. Build section by section
Go top to bottom. After each, run the dev server (`npm run dev`, open http://localhost:3000), look at it, and give feedback before moving on. Suggested prompts:
- > Build the sticky header + nav per CLAUDE.md and the cana-brand skill.
- > Build the hero using the hero copy from site-copy.md. Use /public/images/luminary.jpg as the background for now. Apply the frontend-design skill — lots of whitespace, calm text in a corner, one primary CTA.
- > Build the Our Story section (alternating image/text), copy from site-copy.md.
- > Build The Pieces grid from content/products.md — gift set first. Each "Pre-order" button links to its STRIPE_LINK placeholder (open in new tab).
- > Build Why a Founding Batch, The Blessing Card, Join the First Table (email form), FAQ (accordion), and the Footer — all from site-copy.md.
- > Now do a full responsive + accessibility pass at 375 / 768 / 1280, and add gentle scroll-reveal motion that respects reduced-motion.

## 3. Add your real assets
- Drop product photos into `/public/images/` using the filenames in products.md (`giftset.jpg`, `mug.jpg`, `dish.jpg`, `luminary.jpg`, plus `box.jpg`, `card.jpg`).
- Add a favicon from the coin mark.

## 4. Wire up checkout (Stripe Payment Links)
1. In Stripe → **Payment Links** → create one link per product (Gift Set, Mug, Dish, Luminary) with the price and a "ships in 6–8 weeks" note in the description.
2. Tell Claude Code:
   > Replace each STRIPE_LINK_* placeholder with these real Payment Link URLs: [paste them].
3. Test each button.

## 5. Email capture + Meta Pixel
- Email: connect the form to Mailchimp/Resend, or paste an embeddable form. Prompt: > Wire the Join the First Table form to [service].
- Pixel: > Add my Meta Pixel (ID: XXedit) to the site head for conversion tracking. (Get the ID from Meta Events Manager.)

## 6. Deploy to GitHub + Vercel
1. > Initialize git, create a .gitignore, and make the first commit.
2. Create a new empty repo on GitHub, then: > Add the remote and push.
3. Go to **vercel.com → New Project → import the GitHub repo → Deploy.** Vercel auto-detects Next.js.
4. In Vercel → Settings → Domains, add **canaceramics.com** (or thecanaco.com) and follow the DNS steps. (Point your Hostinger domain's nameservers/records as Vercel instructs.)

## 7. Before you drive ads to it
- Proofread every verse and reference (accuracy is trust).
- Test a real pre-order end to end on your phone.
- Confirm the ship date you promise is one you can keep; refund policy visible.
- Then launch the smoke test: two ad versions (loud-scripture vs softer-phrase) → this page → watch pre-orders.

---

**Tip:** if a section comes out looking generic, don't accept it — tell Claude Code "this looks like a template; apply the frontend-design skill: more whitespace, stronger type hierarchy, remove an element." Iterate from a screenshot.
