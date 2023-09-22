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
        light: '#EBF2E7',
      },
      green: {
        DEFAULT: '#579636',
        light: '#EBF2E7',
      },
      light: '#ECEEF1',
      light2: '#F7F8F9',
      divider: '#C8CFD9',
      soft: '#F7F8F9',
      placeholder: '#858585',
      info: {
        DEFAULT: '#3171AF', // my custom
        light: '#E6EEF5', // my custom
      },
      warning: {
        DEFAULT: '#E07B04',
        light: '#FCF2E6',
      },
      negative: {
        DEFAULT: '#D00000',
        light: '#FAE5E5',
      },
      visitorCard: {
        DEFAULT: '#3171AF',
        light: '#EFF4F9',
      },
      parkingZone: '#71CA55',
      activeZone: '#F1B830',
    },
    extend: {
      borderWidth: {
        DEFAULT: '2px',
        px: '1px',
      },
      fontFamily: {
        'belfast-700bold': ['BelfastGrotesk_700Bold'],
        'inter-400regular': ['Inter_400Regular'],
        'inter-600semibold': ['Inter_600SemiBold'],
        'inter-700bold': ['Inter_700Bold'],
      },
    },
  },
}
