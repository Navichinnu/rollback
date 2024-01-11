/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./node_modules/tw-elements/dist/js/**/*.js",
    ],
    theme: {
        extend: {
            fontSize: {
                "1xs": "12px",
                xs: "14px",
                base: "16px",
                sm: "18px",
                md: "20px",
                lg: "22px",
                xl: "24px",
                "2xl": "36px",
                "3xl": "42px",
                "4xl": "56px",
                "5xl": "80px",
            },
            colors: {
                darkBlack: "#101828",
                blue: "#0C173A",
                secondry: "#A2D61B",
                blueshade1: "#667085",
                dimblue: "#5872C7",
                green: "#9BD505",
                lightgreen: "#D7E9A9",
                grey: "#E4E7EC",
                lightgrey: "#475467",
                greyshade1: "#F2F4F7",
                skyblue: "#BEE1E6",
                greenyellow: "#698D08",
                maryblue: "#006D77",
            },
            screens: {
                sm: "640px",
                // => @media (min-width: 640px) { ... }

                md: "768px",
                // => @media (min-width: 768px) { ... }

                lg: "1024px",
                // => @media (min-width: 1024px) { ... }

                xl: "1280px",
                // => @media (min-width: 1280px) { ... }

                "2xl": "1536px",
                // => @media (min-width: 1536px) { ... }

                "3xl": "1700px",
                // => @media (min-width: 1700px) { ... }
            },
        },
        fontFamily: {
            chivo: ["Chivo", "sans-serif"],
            inter: ["Inter", "sans-serif"],
            noto: ["Noto", "sans-serif"],
        },
    },
    plugins: [require("tw-elements/dist/plugin", "@tailwindcss/line-clamp")],
};