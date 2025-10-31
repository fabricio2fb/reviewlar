import Image from 'next/image';
import imageData from '@/lib/placeholder-images.json';
import Link from 'next/link';

export default function AboutPage() {
  const aboutImage = imageData.placeholderImages.find(img => img.id === 'about-us');

  return (
    <>
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-headline font-bold">Sobre o ReviewLar</h1>
              <p className="mt-4 text-xl text-muted-foreground">
                Sua bússola no universo dos eletrodomésticos.
              </p>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="font-headline">Quem Somos</h2>
                <p>
                  Bem-vindo ao ReviewLar! Nascemos de uma paixão simples: ajudar consumidores como você a tomar as melhores decisões na hora de equipar a casa. Em um mercado cheio de opções e informações técnicas complexas, nossa missão é ser sua fonte confiável e descomplicada para reviews de eletrodomésticos e produtos para o lar.
                </p>
              </section>

              <section>
                <h2 className="font-headline">Nossa Metodologia</h2>
                <p>
                  Para garantir que nossas análises sejam imparciais e realmente úteis, seguimos uma metodologia rigorosa. Cada review é fruto de horas de pesquisa, comparação de especificações técnicas, análise de opiniões de consumidores reais e, sempre que possível, testes práticos.
                </p>
                <ul>
                    <li><strong>Pesquisa de Mercado:</strong> Identificamos os produtos mais populares e relevantes em cada categoria.</li>
                    <li><strong>Análise Criteriosa:</strong> Avaliamos cada produto com base em critérios claros, como desempenho, custo-benefício, design, consumo de energia e durabilidade.</li>
                    <li><strong>Opinião Real:</strong> Consolidamos o feedback de centenas de usuários para entender como o produto se comporta no dia a dia.</li>
                    <li><strong>Conteúdo Claro:</strong> Traduzimos o "tecniquês" para uma linguagem que todos possam entender, focando no que realmente importa para sua decisão de compra.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="font-headline">Por Que Confiar em Nós?</h2>
                <p>
                  Nosso compromisso número um é com a transparência e a honestidade. Não temos vínculo com fabricantes e nossas opiniões não estão à venda. Queremos que você se sinta seguro ao seguir nossas recomendações, sabendo que elas foram feitas pensando nos seus melhores interesses.
                </p>
              </section>

              <section>
                <h2 className="font-headline">Como Ganhamos Dinheiro?</h2>
                <p>
                  Manter um site com conteúdo de qualidade tem seus custos. Para isso, monetizamos o ReviewLar de duas formas principais:
                </p>
                <ul>
                    <li><strong>Publicidade (Google AdSense):</strong> Exibimos anúncios em nosso site. Esses anúncios nos ajudam a cobrir os custos operacionais.</li>
                    <li><strong>Links de Afiliados:</strong> Quando você clica em um link de um produto e faz uma compra, podemos receber uma pequena comissão da loja, sem nenhum custo extra para você.</li>
                </ul>
                <p>
                  É importante ressaltar que essa monetização não influencia nossas avaliações. Nossa prioridade é e sempre será a imparcialidade de nossos reviews.
                </p>
              </section>

              <section>
                <h2 className="font-headline">Nossa Equipe</h2>
                <p>
                  O ReviewLar é mantido por uma pequena equipe de entusiastas de tecnologia e redação, liderada por Alex, nosso fundador. Somos apaixonados por testar, comparar e descobrir os melhores produtos para tornar o seu lar mais prático e confortável.
                </p>
              </section>
              
              <section>
                <h2 className="font-headline">Entre em Contato</h2>
                <p>
                  Adoramos ouvir nossos leitores! Se você tem alguma dúvida, sugestão de produto para analisarmos ou qualquer feedback, por favor, <Link href="/contato">entre em contato conosco</Link>. Sua opinião é fundamental para melhorarmos o ReviewLar a cada dia.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
