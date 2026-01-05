import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#FF6B9D', accent: '#C44569', hover: '#8E3A59' } },
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
