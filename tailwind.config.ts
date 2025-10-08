import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/content/**/*.{mdx}',
  ],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#E11D48' } },
      typography: ({ theme }: any) => ({
        DEFAULT: {
          css: {
            a: { color: theme('colors.brand.DEFAULT') },
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config
