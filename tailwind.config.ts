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
        brand: {
          teal: {
            DEFAULT: '#1B857D',
            dark: '#13635D',
            light: '#E8F4F3',
          },
          orange: {
            DEFAULT: '#E85D36',
            dark: '#D04A23',
            light: '#FDF2EE',
          },
          gold: '#E6A834',
          purple: '#5B4A82',
          olive: '#6E8E56',
          gray: {
            surface: '#E2E6E9',
            light: '#F8FAFC',
          }
        },
        primary: {
          DEFAULT: '#1B857D',
          hover: '#13635D',
          light: '#E8F4F3',
        },
        secondary: {
          DEFAULT: '#E85D36',
          hover: '#D04A23',
          light: '#FDF2EE',
        },
        neutral: {
          bg: "#F8FAFC",
          text: "#1E293B",
          border: "#E2E6E9",
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
