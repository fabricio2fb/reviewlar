import Image from 'next/image';
import imageData from '@/lib/placeholder-images.json';

export default function AboutPage() {
  const aboutImage = imageData.placeholderImages.find(img => img.id === 'about-us');

  return (
    <>
      
      <main className="flex-1 bg-card">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-headline font-bold">Sobre o ReviewLar</h1>
              <p className="mt-4 text-xl text-muted-foreground">
                Sua bússola no universo dos eletrodomésticos.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 flex justify-center">
                {aboutImage && (
                  <Image
                    src={aboutImage.imageUrl}
                    alt="Foto do fundador do ReviewLar"
                    width={250}
                    height={250}
                    className="rounded-full object-cover aspect-square shadow-lg"
                    data-ai-hint={aboutImage.imageHint}
                  />
                )}
              </div>
              <div className="md:col-span-2 prose prose-lg dark:prose-invert max-w-none">
                <h2 className="font-headline">Quem Somos</h2>
                <p>
                  Olá! Eu sou o Alex, o fundador do ReviewLar. Sou um entusiasta de tecnologia e apaixonado por encontrar o produto perfeito que equilibra qualidade, preço e funcionalidade. Cansado de reviews vagos e patrocinados, decidi criar um espaço onde a honestidade e a análise aprofundada vêm em primeiro lugar.
                </p>
                <h2 className="font-headline">Nossa Missão</h2>
                <p>
                  No ReviewLar, nossa missão é simples: te ajudar a fazer a melhor compra. Testamos e analisamos cada eletrodoméstico como se estivéssemos comprando para nossa própria casa. Apresentamos os prós, os contras, e todos os detalhes técnicos para que você tenha total confiança na sua decisão.
                </p>
                <p>
                  Queremos ser a sua fonte confiável de informação, transformando a tarefa complexa de escolher um novo aparelho em uma experiência simples e segura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
