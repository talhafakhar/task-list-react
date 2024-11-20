/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";

module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", flowbite.content(),
    ],
    theme: {
        extend: {
            colors: {
                'primary-dark': '#575656',
                'primary-light': '#062e3f',
                'transparent-black': 'rgba(0,0,0,0.32)',
                'transparent-white': 'rgba(255,255,255,0.32)',
                'caribbean-green': '#1abc9c',
                'caribbean-green-dark': '#148f77',
            },
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
                cursive: ['Edu AU VIC WA NT Pre', 'cursive'],
            },
            transitionDuration: {
                '300': '300ms',
            },
        },
    },
    plugins: [
        flowbite.plugin(),
    ],
}
