/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "15px",
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "960px",
            xl: "1200px",
        },
        extend: {
            fontFamily: {
                primary: ["var(--font-jetbrainsMono)", "monospace"],
            },
            colors: {
                dark: "#1c1c22",
                accent: {
                    DEFAULT: "#00ff99",
                    hover: "#00e187",
                },
            },
        },
    },
    plugins: [],
};
