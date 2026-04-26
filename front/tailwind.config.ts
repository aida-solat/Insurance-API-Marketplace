import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neutral / surface scale (slate). Names kept for backwards-compat
        // with existing class strings; values flipped for an enterprise
        // light theme (white surfaces, slate text).
        forest: {
          950: "#FFFFFF", // used as button text on navy (white)
          900: "#F8FAFC", // page background
          800: "#F1F5F9", // panel / hover
          700: "#E2E8F0", // border
          600: "#CBD5E1",
          500: "#94A3B8",
          400: "#64748B",
          300: "#475569", // muted body text
        },
        // Brand accent scale (deep navy — institutional / NA insurance).
        // Names kept for backwards-compat ("gold-*" now reads as navy).
        gold: {
          500: "#0B2545", // primary navy
          400: "#13315C",
          300: "#1E4D8C",
          200: "#0F172A", // headings (near-black)
          100: "#0B2545",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.035em",
      },
      boxShadow: {
        gold: "0 1px 2px rgba(15,23,42,0.06), 0 4px 16px -6px rgba(11,37,69,0.18)",
        "gold-lg":
          "0 4px 12px rgba(15,23,42,0.08), 0 20px 48px -16px rgba(11,37,69,0.25)",
      },
      backgroundImage: {
        "grid-forest":
          "linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
        "radial-gold":
          "radial-gradient(circle at 50% 0%, rgba(11,37,69,0.08), transparent 65%)",
      },
    },
  },
  plugins: [],
};

export default config;
