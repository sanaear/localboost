import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary": "#ac3400",
        "on-primary": "#ffffff",
        "on-tertiary-container": "#7c2300",
        "on-secondary-fixed": "#002115",
        "on-error-container": "#93000a",
        "inverse-primary": "#ffb952",
        "on-background": "#1a1c1b",
        "primary-fixed": "#ffddb3",
        "surface-bright": "#f9f9f7",
        "primary": "#825500",
        "on-tertiary-fixed": "#390c00",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e8e8e6",
        "error": "#ba1a1a",
        "tertiary-fixed": "#ffdbd0",
        "background": "#f9f9f7",
        "primary-container": "#eba020",
        "error-container": "#ffdad6",
        "tertiary-container": "#ff926d",
        "surface-variant": "#e2e3e1",
        "surface-container-highest": "#e2e3e1",
        "secondary-container": "#8af4c5",
        "surface-tint": "#825500",
        "on-error": "#ffffff",
        "on-primary-fixed-variant": "#633f00",
        "on-tertiary-fixed-variant": "#832600",
        "outline-variant": "#d7c3ae",
        "secondary-fixed-dim": "#70daad",
        "primary-fixed-dim": "#ffb952",
        "on-surface-variant": "#524534",
        "on-surface": "#1a1c1b",
        "surface": "#f9f9f7",
        "tertiary-fixed-dim": "#ffb59d",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#007150",
        "surface-dim": "#dadad8",
        "on-tertiary": "#ffffff",
        "inverse-surface": "#2f3130",
        "secondary-fixed": "#8df7c8",
        "outline": "#847562",
        "on-primary-fixed": "#291800",
        "on-primary-container": "#5d3b00",
        "surface-container": "#eeeeec",
        "inverse-on-surface": "#f1f1ef",
        "surface-container-low": "#f4f4f2",
        "on-secondary-fixed-variant": "#005139",
        "secondary": "#006c4c"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Manrope", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries")
  ],
};
export default config;
