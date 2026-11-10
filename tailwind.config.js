/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Zilla Slab"', '"Noto Serif"', 'Georgia', 'serif'],
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
        slab: ['"Zilla Slab"', 'Georgia', 'serif'],
        display: ['"Archivo Black"', 'sans-serif'],
      },
      colors: {
        grayscale: {
          bg: '#F5F5F5',
          card: '#FFFFFF',
          text: '#171717',
          secondary: '#737373',
          border: '#E5E5E5',
          button: '#333333',
          buttonHover: '#1f1f1f',
          input: '#FAFAFA',
          muted: '#8A8A8A',
          subtle: '#EEEEEE',
          light: '#F9F9F9'
        }
      },
      borderRadius: {
        'sm': '6px',
        DEFAULT: '8px',
        'md': '10px',
        'lg': '12px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
