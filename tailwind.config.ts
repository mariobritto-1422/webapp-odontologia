import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A56DB',
          dark: '#1648C0',
          light: '#EEF2FF',
        },
        brand: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
      },
    },
  },
  plugins: [],
}

export default config
