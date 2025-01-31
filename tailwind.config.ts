import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "slow-pulse": "slow-pulse 5s infinite ease-in-out",
        "clouds-move": "clouds-move 20s infinite linear",
        "mist-flow": "mist-flow 10s infinite ease-in-out",
        "rain-light": "rain-light 15s infinite linear",
        "thunderstorm": "thunderstorm 1.5s infinite ease-in-out",
        "snowfall": "snowfall 20s infinite linear",
        "hailstorm": "hailstorm 10s infinite linear",
        "windy": "windy 6s infinite ease-in-out",
        "stars-twinkle": "stars-twinkle 3s infinite ease-in-out",
      },
      keyframes: {
        "slow-pulse": {
          "0%, 100%": { opacity: "0.9" },
          "50%": { opacity: "1" },
        },
        "clouds-move": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "200px 0" },
        },
        "mist-flow": {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        "rain-light": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 200px" },
        },
        "thunderstorm": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7", backgroundColor: "#333" },
        },
        "snowfall": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 500px" },
        },
        "hailstorm": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 300px" },
        },
        "windy": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-5px)" },
        },
        "stars-twinkle": {
          "0%, 100%": { opacity: "0.9" },
          "50%": { opacity: "1" },
        },
      },  
    },
  },
  plugins: [],
} satisfies Config;
