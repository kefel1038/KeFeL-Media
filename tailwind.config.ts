import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F97316",
          dark: "#EA6C0A",
          light: "#FB923C",
        },
        ink: {
          DEFAULT: "#111111",
          soft: "#333333",
          muted: "#666666",
        },
        surface: {
          DEFAULT: "#F8F8F8",
          card: "#FFFFFF",
          dark: "#18181B",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        headline: ['"Playfair Display"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
