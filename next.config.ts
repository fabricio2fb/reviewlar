import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // ========================================
      // 🖼️ ADICIONE NOVOS DOMÍNIOS DE IMAGENS AQUI
      // ========================================
      // Exemplo de como adicionar:
      // {
      //   protocol: 'https',
      //   hostname: 'exemplo.com',
      //   port: '',
      //   pathname: '/**',
      // },
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
        hostname: '**.vtexassets.com', // Todos os subdomínios vtexassets
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Para Supabase Storage
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.amazon.com.br', // ← NOVO
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazon.com.br', // ← Todos os subdomínios Amazon BR
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
