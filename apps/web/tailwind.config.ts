import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#FF6B35",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        local: {
          500: "#10b981",
          600: "#059669",
        },
        traveler: {
          500: "#FF6B35",
          600: "#ea580c",
        },
      },
      animation: {
        "spin-slow": "spin 1s linear",
      },
    },
  },
  plugins: [],
}

export default config
