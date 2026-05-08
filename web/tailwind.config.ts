import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#003322',
          'green-dark': '#062419',
          gold: '#C5A059',
          'gold-light': '#D4B06A',
          terracotta: '#B35C37',
          petrol: '#004B5E',
          'green-light': '#004d33',
          'gold-muted': 'rgba(197,160,89,0.5)',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gourmet: '0 4px 24px rgba(0, 0, 0, 0.12)',
        'gourmet-lg': '0 8px 40px rgba(0, 0, 0, 0.18)',
        'gold-glow': '0 0 24px rgba(197, 160, 89, 0.35)',
        'card': '0 2px 40px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
