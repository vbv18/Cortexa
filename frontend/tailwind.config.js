/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            colors: {
                primaryBtnBg: "#5046e4",
                primaryBg: "#f9fafb",

                secondaryBtnBg: "#e0e7ff",
                secondaryBtnTxt: "#625ad4",

                tagBg: "#eef2ff",
                tagTxt: "#817cec",
            }
        },
    },

    plugins: [],
}