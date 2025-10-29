import Link from 'next/link';
import { Icons } from './icons';
import { categories } from '@/lib/data';
import { Instagram } from 'lucide-react';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);


export default function SiteFooter() {
  const socialLinks = [
    { title: 'Instagram', href: 'https://www.instagram.com/reviewlar/', icon: <Instagram className="h-5 w-5" /> },
    { title: 'TikTok', href: '#', icon: <TikTokIcon className="h-5 w-5" /> },
  ];

  const mainCategories = categories.slice(0, 5);

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline text-foreground">
                ReviewLar
              </span>
            </Link>
            <p className="text-sm">
              Análises honestas e detalhadas para te ajudar a escolher o eletrodoméstico perfeito para sua casa.
            </p>
          </div>

          <div>
            <h3 className="font-headline font-semibold text-foreground mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li><Link href="/sobre" className="text-sm hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link href="/contato" className="text-sm hover:text-primary transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold text-foreground mb-4">Categorias</h3>
            <ul className="space-y-2">
              {mainCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categoria/${category.slug}`}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
               <li><Link href="/categorias" className="text-sm font-bold text-primary hover:underline">Ver todas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
                <li><Link href="/politica-de-privacidade" className="text-sm hover:text-primary transition-colors">Política de Privacidade</Link></li>
                <li><Link href="/termos-de-uso" className="text-sm hover:text-primary transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold text-foreground mb-4">Siga-nos</h3>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={item.title}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} ReviewLar. Todos os direitos reservados.</p>
           <p className="mt-1">O ReviewLar participa de programas de afiliados. Isso significa que podemos receber comissões por compras feitas através de nossos links, sem custo adicional para você. Isso nos ajuda a manter o site e a continuar produzindo conteúdo de qualidade.</p>
        </div>
      </div>
    </footer>
  );
}
