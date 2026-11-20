import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '24px', screens: { '2xl': '1440px' } },
    extend: {
      colors: { bg: '#05060a', surface: '#0a0d16', primary: '#7c3aed', accent: '#22d3ee', text: '#f5f5f7', muted: '#8b8fa3' },
      fontFamily: { display: ['Clash Display', 'sans-serif'], sans: ['Inter', 'sans-serif'] }
    }
  }, plugins: []
} satisfies Config;
