import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Necessário para @react-pdf/renderer funcionar no servidor
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
}

export default nextConfig
