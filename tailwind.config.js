const nativewind = require('nativewind/tailwind')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './utils/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [nativewind],
  plugins: [
    // https://github.com/marklawlor/nativewind/issues/386
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          g: (value) => ({
            gap: value,
          }),
        },
        { values: theme('g') },
      )
    }),
  ],
  theme: {
    // https://github.com/marklawlor/nativewind/issues/386
    g: ({ theme }) => theme('spacing'),
    fontSize: {
      h1: ['1.5rem', '2rem'], // 24px / 32px
      h2: ['1.25rem', '1.5rem'], // 20px / 24px
      h3: ['1rem', '1.5rem'], // 16px / 24px
      16: ['1rem', '1.5rem'], // 16px / 24px
      14: ['0.875rem', '1.5rem'], // 14px / 24px
    },
    borderRadius: {
      none: '0',
      full: '9999px',
      DEFAULT: '0.5rem',
      sm: '0.25rem',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      dark: {
        DEFAULT: '#16254C',
      },
      light2: '#F7F8F9',
      green: {
        DEFAULT: '#579636',
        light: '#EBF2E7',
      },
      soft: {
        DEFAULT: '#F7F8F9',
      },
      divider: {
        DEFAULT: '#C8CFD9',
      },
      warning: {
        100: '#FCF2E6',
      },
      info: {
        DEFAULT: '#3171AF',
        100: '#E6EEF5',
      },
      negative: {
        DEFAULT: '#D00000',
        100: '#FAE5E5',
      },
      visitorCard: '#3171AF',
      parkingZone: '#71CA55',
      activeZone: '#F1B830',
      custom: {
        light: '#ECEEF1',
      },
    },
    extend: {
      fontFamily: {
        belfast: ['BelfastGrotesk_Black'],
      },
    },
  },
}
