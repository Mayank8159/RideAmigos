/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google Auth avatars
  },
  // Ensure Mapbox works during production builds
  transpilePackages: ['lucide-react'] 
};

export default nextConfig;