import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@huggingface/transformers'],
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'onnxruntime-node$': false,
    }
    return config
  },
}

export default nextConfig
