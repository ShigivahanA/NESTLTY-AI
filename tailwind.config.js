/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#B0FFFA',
          100: '#B0FFFA',
          200: '#B0FFFA',
          300: '#B0FFFA',
          400: '#B0FFFA',
          500: '#00F7FF',
          600: '#00F7FF', // Using same core color for intense action state to strictly use the provided colors
          700: '#00F7FF',
          800: '#00F7FF',
          900: '#00F7FF',
          950: '#00F7FF',
        },
        accent: {
          50: '#FF7DB0',
          100: '#FF7DB0',
          200: '#FF7DB0',
          300: '#FF7DB0',
          400: '#FF7DB0',
          500: '#FF0087',
          600: '#FF0087',
          700: '#FF0087',
          800: '#FF0087',
          900: '#FF0087',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
