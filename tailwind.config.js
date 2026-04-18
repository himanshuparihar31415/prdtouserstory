/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#3B5BDB',
          orange: '#E8450A',
          bg: '#F0F2F8',
          card: '#FFFFFF',
          active: '#E8EEFF',
          icon: '#EEF0F8',
          text: '#1A1D2E',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.07)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};

