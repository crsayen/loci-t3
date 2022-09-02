/** @type {import('tailwindcss').Config} */
const spacing = Object.fromEntries(
  Array(31)
    .fill(null)
    .map((_, i) => ['' + (i + 1), '' + (i + 1) / 4 + 'rem'])
)

spacing.huge = '60rem'

module.exports = {
  content: ['./src/**/*.tsx'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      spacing,
      outline: {
        red: '1px dotted red',
        green: '1px dotted green',
        blue: '1px dotted blue',
        'solid-black': '1px solid black',
      },
    },
    fontSize: {
      xxxs: ['0.4rem', { lineHeight: '0.5rem' }],
      xxs: ['0.6rem', { lineHeight: '0.75rem' }],

      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
