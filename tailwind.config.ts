import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        canvas: "#FBFAF7",
        ink: {
          DEFAULT: "#0B0B0F",
          muted: "#5B5B6B",
          soft: "#8A8A98",
        },
        coral: {
          50: "#FFF1F1",
          100: "#FFE0E0",
          200: "#FFC5C5",
          300: "#FF8FB1",
          400: "#FF8080",
          500: "#FF6B6B",
          600: "#E85656",
          700: "#C14444",
        },
        plum: {
          100: "#EDE8FF",
          300: "#B3A0FF",
          500: "#7C5CFF",
          600: "#6845E6",
        },
        sage: {
          100: "#E8F2EC",
          200: "#C7E3D4",
          400: "#6FAA8A",
          700: "#2D5F46",
        },
        hairline: "#E8E6E0",
        // 互換性のため旧brand.*も維持
        brand: {
          navy: "#0B0B0F",
          pink: "#FF6B6B",
          bg: "#FBFAF7",
        },
        border: "#E8E6E0",
        ring: "#0B0B0F",
      },
      fontFamily: {
        display: [
          "var(--font-display-en)",
          "var(--font-display-jp)",
          "serif",
        ],
        sans: [
          "var(--font-sans-jp)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": [
          "clamp(2.5rem, 7vw, 6rem)",
          { lineHeight: "0.95", letterSpacing: "-0.04em" },
        ],
        "display-lg": [
          "clamp(2rem, 5vw, 4rem)",
          { lineHeight: "1.0", letterSpacing: "-0.035em" },
        ],
        "display-md": [
          "clamp(1.5rem, 3vw, 2.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.025em" },
        ],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        card: "0 1px 0 rgba(11,11,15,0.04), 0 12px 32px -16px rgba(124,92,255,0.12)",
        "card-hover":
          "0 1px 0 rgba(11,11,15,0.04), 0 20px 48px -16px rgba(255,107,107,0.18)",
        cta: "0 1px 0 0 rgba(255,255,255,0.1) inset, 0 8px 24px -8px rgba(11,11,15,0.4)",
        "cta-hover":
          "0 1px 0 0 rgba(255,255,255,0.15) inset, 0 12px 32px -8px rgba(124,92,255,0.35)",
        ring: "0 0 0 4px rgba(124,92,255,0.15)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #FF6B6B 0%, #FF8FB1 50%, #7C5CFF 100%)",
        "grid-dots":
          "radial-gradient(circle, rgba(11,11,15,0.06) 1px, transparent 1px)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease-out",
        "float-slow": "float 8s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
