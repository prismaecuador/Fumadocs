import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#3B82F6', accent: '#10B981', hover: '#F59E0B' } },
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
