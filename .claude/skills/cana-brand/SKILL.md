---
name: cana-brand
description: The Cana visual identity system — colors, typography, spacing, components, motifs, and voice. Use for EVERY styling and copy decision on the Cana website so the whole site reads as one premium, warm, legibly-Christian brand. Trigger whenever choosing colors, fonts, layout, components, imagery, or writing copy for Cana.
---

# Cana brand system

Cana = heirloom ceramics for the Christian home; Scripture carved into clay. The feeling: warm, calm, sacred, hospitable, expensive-but-understated. **Quiet luxury, not craft-fair.** When in doubt: more whitespace, less ornament.

## Color tokens
Use these exact values. Backgrounds dominate (~70%), ink ~20%, olive ~8%, gold rare (~2%). No pure white, no pure black, no neon.

| Token | Hex | Use |
|---|---|---|
| `bone` | #F4EDDE | primary background / "the clay" |
| `linen` | #E7DAC4 | secondary surfaces, cards, footer |
| `umber` | #54442F | primary ink, marks, headings |
| `espresso` | #3A2E20 | body text (highest contrast) |
| `olive` | #7C7A53 | accent: links, small rules, the sprig |
| `gold` | #B5934E | rare precious accent (dividers, hover) |
| `terra` | #B5683F | seasonal warm accent — use almost never |

Tailwind (`tailwind.config.ts`):
```ts
theme: { extend: { colors: {
  bone:'#F4EDDE', linen:'#E7DAC4', umber:'#54442F',
  espresso:'#3A2E20', olive:'#7C7A53', gold:'#B5934E', terra:'#B5683F'
}}}
```

## Typography
- **Headings, the wordmark, and verses:** Cormorant Garamond (high-contrast serif). Headings often in small-caps or wide-tracked caps for the wordmark feel.
- **Body, buttons, nav, UI:** Work Sans (clean humanist sans). Never set long body copy in the serif.
- Load via `next/font/google`. Generous line-height (body ~1.7). Sentence case for body; the wordmark "CANA" is caps with wide letter-spacing.
- Scale (suggested): display 48–72px, h2 32–40px, h3 22–26px, body 17–18px, small 14px. Fluid/responsive.

```ts
import { Cormorant_Garamond, Work_Sans } from 'next/font/google'
export const serif = Cormorant_Garamond({ subsets:['latin'], weight:['400','500','600'], variable:'--font-serif' })
export const sans  = Work_Sans({ subsets:['latin'], weight:['300','400','500'], variable:'--font-sans' })
```

## Layout & spacing
- Max content width ~1100–1200px, centered, with wide page gutters.
- Very generous vertical rhythm between sections (≥96px desktop). Let sections breathe.
- Border radius: small and soft (4–8px), never bubbly. Thin 1px rules in `olive`/`gold` at low opacity.
- Mobile-first; everything must look intentional at 375px wide.

## Components
- **Buttons:** primary = solid `umber` bg, `bone` text, subtle hover (slightly darker / gentle lift). Secondary = `umber` text with a thin `umber` outline. Rounded 6px. Generous padding. Calm, no shadows-heavy.
- **Product card:** large image on `linen`, then name (serif), the verse + small reference (serif, reference is a quiet colophon in `olive`), one line of body, price, and a "Pre-order" button. Lots of padding; no borders or 1px hairline only.
- **Nav:** transparent over hero, becomes `bone` on scroll. Wordmark left, links right in `sans`.
- **Section heading pattern:** small olive sprig or a short `gold` rule, then a serif heading, then 1–2 lines of `sans` intro. Centered or left, stay consistent.

## Motifs
- **Olive sprig:** the recurring decorative cue (section openers, dividers, tissue/pattern). Simple, naturalistic. Never grapes or vines.
- **Coin mark:** a circular "CANA · GALILEE" stamp — used as the footer mark, favicon, and the small badge on packaging imagery. Authority mark, used sparingly.
- **Wordmark:** "CANA" in Cormorant caps, wide tracking.

## Imagery rules
- Warm natural light, golden-hour glow; linen, raw wood, ivory-stone surfaces; fresh olive branches.
- Calm, sacred, hospitable. Generous negative space in photos too.
- **Never** wine/alcohol/grapes. No cool/blue light, no hard flash, no clutter, no graphic overlays on hero images.

## Voice
Warm, literate, reverent but not preachy — a gracious host, not a pulpit or a salesperson. Short, lovely sentences. Cite verses accurately (e.g., "Psalm 46:10").
- **Avoid:** "blessed beyond measure", "faith-filled", urgency/hype, exclamation spam.
- **Prefer:** blessing, carved, kept, heirloom, gather, the table, the everyday made sacred.

## The one test
If a choice makes the page louder, busier, or cheaper-feeling, it's wrong. Cana wins by restraint.
