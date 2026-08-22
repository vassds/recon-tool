/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(217, 33%, 12%)',
        input: 'hsl(217, 33%, 12%)',
        ring: 'hsl(250, 89%, 67%)',
        background: 'hsl(224, 71%, 4%)',
        foreground: 'hsl(213, 31%, 91%)',
        primary: {
          DEFAULT: 'hsl(250, 89%, 67%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(217, 33%, 17%)',
          foreground: 'hsl(213, 31%, 91%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        muted: {
          DEFAULT: 'hsl(217, 33%, 12%)',
          foreground: 'hsl(215, 20%, 55%)',
        },
        accent: {
          DEFAULT: 'hsl(217, 33%, 17%)',
          foreground: 'hsl(213, 31%, 91%)',
        },
        card: {
          DEFAULT: 'hsl(224, 71%, 6%)',
          foreground: 'hsl(213, 31%, 91%)',
        },
        success: {
          DEFAULT: 'hsl(142, 71%, 45%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        warning: {
          DEFAULT: 'hsl(38, 92%, 50%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
