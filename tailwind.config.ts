import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: "#F4EDDE",
        linen: "#E7DAC4",
        umber: "#54442F",
        espresso: "#3A2E20",
        olive: "#7C7A53",
        // darker olive for small text labels so they clear WCAG AA (the brand
        // olive is reserved for decorative sprigs, rules, hovers)
        oliveink: "#5E5C3B",
        gold: "#B5934E",
        terra: "#B5683F",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1180px",
      },
      letterSpacing: {
        wordmark: "0.32em",
        wide2: "0.18em",
      },
      fontSize: {
        display: ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1.04", letterSpacing: "-0.01em" }],
        h2: ["clamp(2rem, 4vw, 2.6rem)", { lineHeight: "1.12" }],
        h3: ["clamp(1.3rem, 2.4vw, 1.6rem)", { lineHeight: "1.2" }],
      },
    },
  },
  plugins: [],
};

export default config;
