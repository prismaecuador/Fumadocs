import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#a1674a', accent: '#d9b39a', hover: '#33251c' } },
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
