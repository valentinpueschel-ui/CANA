---
name: frontend-design
description: How to build a genuinely premium, editorial, non-generic website frontend — layout, hierarchy, whitespace, type, restrained motion, responsiveness, accessibility, and performance. Use alongside the cana-brand skill whenever building or refining any page, section, or component.
---

# Frontend design — build it beautiful, not generic

The default AI website look (full-width gradient hero, three equal feature cards, rounded-everything, emoji icons, dropshadows) is what we are avoiding. Aim for the restraint of a high-end editorial / fashion-house site.

## First principles
- **Whitespace is the design.** Premium pages are mostly empty space. Increase padding until it feels almost too much, then keep it.
- **One clear hierarchy per screen.** A visitor should instantly know what to read first, second, third. Big serif headline → short sub → one primary action.
- **One primary action per section.** Don't compete CTAs.
- **Restraint over decoration.** No gradients, heavy shadows, glows, or emoji. Thin rules, generous type, real photography.
- **Type does the heavy lifting.** Large confident serif headings; calm readable sans body; tight, intentional line lengths (~60–75 chars).

## Layout patterns to use
- Asymmetry and editorial offsets beat three identical centered cards.
- Full-bleed warm photography for the hero with text in a calm corner — not centered text on a busy image.
- Alternating image/text rows for the story and product sections.
- A real, generous footer.

## Motion (subtle only)
- Gentle fade-and-rise on scroll (opacity 0→1, y 12px→0, ~0.5s ease-out). Stagger lightly.
- Soft hover states (slight darken or 2–3px lift). No bouncing, spinning, or parallax circus.
- Respect `prefers-reduced-motion`.

## Responsiveness
- Design mobile-first; verify at 375px, 768px, 1280px.
- Stack gracefully; keep type readable (min 16px body on mobile); tap targets ≥44px.
- Never let the desktop layout just "squish" — rethink each section for small screens.

## Accessibility (required)
- Semantic HTML (`header/nav/main/section/footer`, real headings in order).
- Alt text on every image; visible focus states; AA contrast (the cana-brand tokens are chosen to pass on bone).
- Forms have labels; buttons are buttons, links are links.

## Performance
- Optimize images (`next/image`, right sizes, lazy below the fold).
- Minimal JS; no heavy libraries for trivial effects. Fast LCP and CLS near zero.
- The page should feel instant and calm.

## Workflow with the human
1. Build **one section at a time**, top to bottom. Show it, summarize, pause for feedback.
2. Match the brand tokens from the cana-brand skill exactly — don't improvise colors or fonts.
3. After a section looks right in code, suggest the human run the dev server and eyeball it; iterate from their screenshot/feedback before moving on.
4. Prefer extracting small reusable components (`Section`, `Container`, `Button`, `ProductCard`).
5. If a section feels generic, fix it with: more whitespace, a stronger type contrast, real photography, and removing an element — not by adding decoration.

## The test
Would this look at home next to a high-end ceramics or fashion brand (think Astier de Villatte, Aesop, East Fork)? If it looks like a template, it's not done.
