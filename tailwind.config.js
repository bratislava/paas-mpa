const nativewind = require('nativewind/tailwind')
const plugin = require('tailwindcss/plugin')
const colors = require('./tailwind.config.colors')

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
      h1: ['24px', '32px'],
      h2: ['20px', '24px'],
      h3: ['16px', '24px'],
      16: ['16px', '24px'],
      14: ['14px', '24px'],
    },
    borderRadius: {
      none: '0',
      full: '9999px',
      lg: '16px',
      DEFAULT: '8px',
      sm: '4px',
    },
    colors: colors,
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
