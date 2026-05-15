/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Cho phép next/image tối ưu ảnh local
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
