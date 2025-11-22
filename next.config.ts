// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // для оптимизации продакшена
  env: {
    CUSTOM_KEY: 'your-value',
  },
}

export default nextConfig