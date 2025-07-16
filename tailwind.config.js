/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          'deep-blue': '#001f3f',
          'light-blue': '#87CEEB',
          'white': '#FFFFFF',
          'slate-gray': '#a0aec0',
        },
      },
    },
    plugins: [],
  };