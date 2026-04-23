import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark green scale
        forest: {
          950: "#04100B",
          900: "#06170F",
          800: "#0A2218",
          700: "#0F3123",
          600: "#14543E",
          500: "#1C7A58",
          400: "#2FA077",
          300: "#5EC49B",
        },
        // Gold accent
        gold: {
          500: "#D4AF37",
          400: "#E2C564",
          300: "#EED898",
          200: "#F4E4B1",
          100: "#F9EFCE",
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
        gold: "0 0 0 1px rgba(212,175,55,0.3), 0 10px 40px -10px rgba(212,175,55,0.25)",
        "gold-lg":
          "0 0 0 1px rgba(212,175,55,0.35), 0 20px 60px -15px rgba(212,175,55,0.35)",
      },
      backgroundImage: {
        "grid-forest":
          "linear-gradient(rgba(212,175,55,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.06) 1px, transparent 1px)",
        "radial-gold":
          "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.18), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
