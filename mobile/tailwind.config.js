/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#003322',
          gold: '#C5A059',
          terracotta: '#E8B422',
          petrol: '#004B5E',
          'green-light': '#004d33',
          'gold-muted': '#C5A05980',
        },
      },
      fontFamily: {
        serif: ['PlayfairDisplay_700Bold'],
        'serif-regular': ['PlayfairDisplay_400Regular'],
        sans: ['Inter_400Regular'],
        'sans-medium': ['Inter_500Medium'],
        'sans-bold': ['Inter_700Bold'],
      },
      backgroundColor: {
     'glass': 'rgba(0, 51, 34, 0.8)',
    },
    },
  },
  plugins: [],
};
