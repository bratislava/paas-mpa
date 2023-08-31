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
    extend: {
      fontFamily: {
        belfast: ['BelfastGrotesk_Black'],
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
        warning: {
          100: '#FCF2E6',
        },
        info: {
          DEFAULT: '#3171AF',
          100: '#E6EEF5',
        },
        negative: {
          100: '#FAE5E5',
          700: '#D00000',
        },
      },
    },
  },
}
