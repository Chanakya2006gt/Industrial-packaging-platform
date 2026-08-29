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
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        // CMYK Process Colors
        cmyk: {
          cyan: 'hsl(var(--cmyk-c))',
          magenta: 'hsl(var(--cmyk-m))',
          yellow: 'hsl(var(--cmyk-y))',
          black: 'hsl(var(--cmyk-k))',
        },

        // Legacy compatibility
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
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
        'theme-xl': 'var(--shadow-xl)',
        'theme-2xl': 'var(--shadow-2xl)',
        'bezel': 'var(--shadow-bezel)',
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
