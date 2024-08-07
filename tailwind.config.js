/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
          'bottom-right': '10px 10px 15px -3px rgba(0, 0, 0, 0.1)',
          'bottom-left': '-10px 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
     
    },
  },
  plugins: [],
};
