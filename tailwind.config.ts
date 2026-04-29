import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        jbi: {
          navy: "#0B1F3A",
          blue: "#005BBB",
          electric: "#1687FF",
          soft: "#EAF4FF",
          gray: "#F6F8FB",
          champagne: "#D8C3A5",
          ink: "#101828",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(11, 31, 58, 0.18)",
        glow: "0 0 0 6px rgba(22, 135, 255, 0.12)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(1200px 600px at 80% -10%, rgba(22,135,255,0.12), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(216,195,165,0.18), transparent 55%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
