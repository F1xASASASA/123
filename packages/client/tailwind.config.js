/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                accent: "var(--tg-theme-button-color)",
            },
            divideColor: {
                primary: "rgb(var(--text-color) / <alpha-value>)",
            },
            backgroundColor: {
                primary: "rgb(var(--background-color) / <alpha-value>)",
                surface: "rgb(var(--surface-color) / <alpha-value>)",
                accent: "var(--tg-theme-button-color)",
                on: {
                    surface: "rgb(var(--text-color) / <alpha-value>)",
                },
                skeleton: "rgb(var(--text-color) / .05)",
            },
            textColor: {
                primary: "rgb(var(--text-color) / <alpha-value>)",
                accent: "var(--tg-theme-button-color)",
                on: {
                    accent: "var(--tg-theme-button-text-color)",
                },
            },
        },
    },
    plugins: [],
}
