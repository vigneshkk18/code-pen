import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#010101",
        btnPrimary: "#454857",
        btnSuccess: "#46cf73",
        btnPrimaryHover: "#5a5f73",
        btnSecondaryHover: "#248c46",
        codeArea: "#1d1e22",
      },
      colors: {
        primary: "#ffffff",
        secondary: "#000000",
      },
    },
  },
  plugins: [],
};
export default config;
