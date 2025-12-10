import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // REMOVA O ESLINT DAQUI - NÃO É MAIS SUPORTADO NO next.config.ts
  images: {
    remotePatterns: [
      // ========================================
      // 🖼️ ADICIONE NOVOS DOMÍNIOS DE IMAGENS AQUI
      // ========================================
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'consul.vtexassets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vtexassets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.amazon.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazon.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**imgs.pontofrio.com.br', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.mlstatic.com', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'reliancedigital.in', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'binglee.com.au', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'currys.co.uk', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a-static.mlcdn.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;