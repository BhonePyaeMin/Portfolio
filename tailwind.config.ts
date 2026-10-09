import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:         "var(--color-bg)",
        bgPanel:    "var(--color-bgPanel)",
        cyan:       "var(--color-cyan)",
        teal:       "var(--color-teal)",
        gold:       "var(--color-gold)",
        "gold-muted": "var(--color-gold-muted)",
        copper:     "var(--color-copper)",
        green:      "var(--color-green)",
        blue:       "var(--color-blue)",
        violet:     "var(--color-violet)",
        coral:      "var(--color-coral)",
        ink:        "var(--color-ink)",
        body:       "var(--color-body)",
        secondary:  "var(--color-secondary)",
        slate:      "var(--color-slate)",
        muted:      "var(--color-muted)",
        border:     "var(--color-border)",
        borderHv:   "var(--color-border-hv)",
        surface:    "var(--color-surface)",
        surfaceHv:  "var(--color-surface-hv)",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body:    ["var(--font-inter)", "sans-serif"],
        mono:    ["var(--font-jetbrains-mono)", "monospace"],
      },
      screens: {
        nav: "860px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
