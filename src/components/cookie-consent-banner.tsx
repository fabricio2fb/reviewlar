'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { Button } from './ui/button';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // A verificação `window.localStorage` garante que o código só rode no cliente
    if (typeof window !== 'undefined' && !localStorage.getItem('cookie_consent')) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookie_consent', 'true');
    }
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div className="text-sm">
            <h3 className="font-semibold font-headline">Este site usa cookies</h3>
            <p className="text-muted-foreground">
              Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e anúncios, e analisar nosso tráfego. 
              Ao continuar navegando, você concorda com nossa{' '}
              <Link href="/politica-de-privacidade" className="underline text-primary hover:text-primary/80">
                Política de Privacidade
              </Link>.
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
          <Button onClick={handleAccept} className="w-full md:w-auto">Aceitar Todos</Button>
        </div>
      </div>
    </div>
  );
}
