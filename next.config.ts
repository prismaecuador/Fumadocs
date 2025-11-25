import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  remarkPlugins: [remarkGfm],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
}

export default withMDX(nextConfig)
