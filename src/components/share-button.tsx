'use client';

import { Share2, Link as LinkIcon, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.78.46 3.45 1.28 4.95L2 22l5.25-1.38c1.45.77 3.06 1.18 4.79 1.18h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.9-9.91-9.9zM17.2 15.6c-.22-.11-.76-.38-1.04-.52-.28-.14-.49-.24-.7.24-.21.48-.78 1.04-1 1.2s-.3.18-.55.06c-.25-.12-1.07-.4-2.04-1.26-.76-.66-1.28-1.48-1.5-1.73s-.05-.38.06-.5c.1-.11.22-.28.33-.42.11-.14.15-.24.22-.4.07-.15.04-.28-.02-.39-.06-.11-.7-1.7-.95-2.32-.25-.62-.5-.53-.7-.54h-.5c-.21 0-.55.08-.84.36-.29.28-.95.92-.95 2.25s.98 2.6 1.12 2.78c.14.18 1.9 2.91 4.6 4.08.64.28 1.14.44 1.54.56.57.17 1.07.15 1.47.09.45-.07 1.39-.57 1.58-1.13.2-.56.2-1.04.14-1.13-.06-.1-.22-.16-.48-.28z" />
    </svg>
  );

export default function ShareButton({ title, url }: { title: string, url: string }) {
  const { toast } = useToast();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link Copiado!',
        description: 'O link para este review foi copiado para a sua área de transferência.',
      });
    } catch (err) {
      console.error('Falha ao copiar o link:', err);
      toast({
        variant: 'destructive',
        title: 'Ops! Algo deu errado.',
        description: 'Não foi possível copiar o link.',
      });
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    instagram: `https://www.instagram.com`, // Instagram does not support direct sharing with pre-filled text via URL
  };

  return (
    <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Compartilhe:</span>
      <Button variant="ghost" size="icon" asChild>
        <Link href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp">
          <WhatsAppIcon className="h-5 w-5 text-green-500" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <Link href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Facebook">
          <Facebook className="h-5 w-5 text-blue-600" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <Link href={shareLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Instagram">
          <Instagram className="h-5 w-5 text-pink-500" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={handleCopyLink} aria-label="Copiar link">
        <LinkIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}