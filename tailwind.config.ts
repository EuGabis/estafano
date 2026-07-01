import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bordo: {
          DEFAULT: "#5B1A1A",
          dark: "#3E1010",
          light: "#7A2A2A",
        },
        dourado: {
          DEFAULT: "#C6A15B",
          light: "#DBC08A",
          dark: "#A9853F",
        },
        creme: "#F7F3EC",
        carvao: "#2A2320",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider2: "0.18em",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
