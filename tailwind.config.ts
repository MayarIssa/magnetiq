import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#B7202E",
          dark: "#8F1621",
          light: "#E85C68",
          cream: "#FBF3EC",
        },
      },
      fontFamily: {
        script: ["var(--font-script)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
