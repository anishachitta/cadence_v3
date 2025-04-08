/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_RETELL_API_KEY: process.env.RETELL_API_KEY,
  },
}

export default nextConfig
