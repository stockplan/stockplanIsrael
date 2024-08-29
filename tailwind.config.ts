import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
      //   padding: {
      //     DEFAULT: "1rem",
      //     sm: "1rem",
      //     md: "1rem",
      //     lg: "2rem",
      //     xl: "3rem",
      //   },
      // screens: {
      //   sm: "480px",
      //   md: "768px",
      //   lg: "976px",
      //   xl: "1440px",
      // },
    },

    extend: {
      screens: {
        sm: "400px",
        md: "500px",
        lg: "700px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        main: "url('/img/bl.png')",
        mobileMain: "url('/img/imgmobileBuildings.svg')",
      },
      colors: {
        "background-main": "#404546",
        header: "#2D5686",
        hoverHeader: "#3A69A3 ",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
