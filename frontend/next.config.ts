import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // TypeScript and module resolution
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      '@radix-ui/react-icons',
      'chart.js',
      'react-chartjs-2',
      'date-fns',
      'recharts'
    ],
    // Improve build performance
    cpus: Math.max(1, (require('os').cpus() || []).length - 1),
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 300, // Increased cache time
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Faster dev server
  onDemandEntries: {
    maxInactiveAge: 120 * 1000, // Increased for better caching
    pagesBufferLength: 10, // Increased buffer
  },

  // Production optimizations
  productionBrowserSourceMaps: false,
    // Enable static exports for better performance where possible
  trailingSlash: false,
};

// Only apply bundle analyzer if available and ANALYZE is true
let finalConfig = nextConfig;
if (process.env.ANALYZE === 'true') {
  try {
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    });
    finalConfig = withBundleAnalyzer(nextConfig);
  } catch (error) {
    console.warn('Bundle analyzer not available, skipping...');
  }
}

export default finalConfig;
