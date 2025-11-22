// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-supabase-domain.supabase.co'],
  },
  env: {
    CUSTOM_KEY: 'your-value',
  },
}

module.exports = nextConfig
