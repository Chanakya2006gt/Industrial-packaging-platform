/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#FAFAFC',
          dark: '#070B12',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#0E1422',
          well: '#F1F4F9',
          'well-dark': '#0A0F1A',
        },
        brand: {
          crimson: '#E00019',
          'crimson-hover': '#B80014',
          'crimson-active': '#990010',
          'crimson-subtle': 'rgba(224, 0, 25, 0.08)',
        },
        cmyk: {
          cyan: '#00A3E0',
          magenta: '#E6007E',
          yellow: '#FFD100',
          black: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0em',
        wide: '0.04em',
        widest: '0.12em',
      },
      boxShadow: {
        'bezel': '0 0 0 1px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.04), 0 8px 16px -4px rgba(15, 23, 42, 0.03)',
        'bezel-dark': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 12px 24px -4px rgba(0, 0, 0, 0.4)',
        'specular': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
        'specular-dark': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)',
        'glow-crimson': '0 0 24px -4px rgba(224, 0, 25, 0.35)',
        'glow-cyan': '0 0 24px -4px rgba(0, 163, 224, 0.35)',
      },
    },
  },
  plugins: [],
}
