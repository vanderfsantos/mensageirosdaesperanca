import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007F7A",
          hover: "#006662",
          light: "#E6F3F2",
        },
        secondary: {
          DEFAULT: "#E65A28",
          hover: "#CF4E20",
          light: "#FDF1ED",
        },
        neutral: {
          bg: "#FAFAFA",
          text: "#1E293B",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
