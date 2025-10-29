import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import { cn } from '@/lib/utils';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import CookieConsentBanner from '@/components/cookie-consent-banner';
import Script from 'next/script'; // 👈 PRECISAMOS IMPORTAR O SCRIPT

export const metadata: Metadata = {
  title: 'ReviewLar',
  description: 'Os melhores reviews de eletrodomésticos para o seu lar.',
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Google AdSense - Substitua 'ca-pub-SEU_ID_AQUI' pelo seu ID! */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2818556857297865"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <div className={cn('font-body min-h-screen flex flex-col')}>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <Toaster />
        <CookieConsentBanner />
      </div>
    </>
  );
}