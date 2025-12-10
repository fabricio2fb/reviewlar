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
                <p>
                  <strong>Nome do Site:</strong> ReviewLar<br />
                  <strong>Proprietário/Editor:</strong> Alex Silva<br />
                  <strong>Localização:</strong> Rio de Janeiro, Brasil<br />
                  <strong>Data de Fundação:</strong> 2024<br />
                  <strong>E-mail de Contato:</strong> contato@reviewlar.com.br
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
                  Nosso compromisso número um é com a transparência e a honestidade. Não temos vínculo direto com fabricantes e nossas opiniões não estão à venda. Queremos que você se sinta seguro ao seguir nossas recomendações, sabendo que elas foram feitas pensando nos seus melhores interesses.
                </p>
                <p>
                  Todas as nossas avaliações são baseadas em critérios objetivos e feedback real de usuários. Quando recebemos produtos para teste, isso é claramente divulgado no artigo correspondente.
                </p>
              </section>

              <section className="bg-muted/50 p-6 rounded-lg border-l-4 border-primary">
                <h2 className="font-headline">Divulgação de Publicidade e Afiliados</h2>
                <p>
                  <strong>Transparência Total:</strong> O ReviewLar mantém-se através de publicidade e programas de afiliados. É importante que você saiba como isso funciona:
                </p>
                <h3 className="text-lg font-semibold mt-4">Publicidade (Google AdSense)</h3>
                <p>
                  Este site exibe anúncios fornecidos pelo Google AdSense. Esses anúncios nos ajudam a manter o site funcionando e produzir conteúdo de qualidade gratuitamente para você. Os anúncios são selecionados automaticamente pelo Google com base no conteúdo da página e seus interesses de navegação.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Links de Afiliados</h3>
                <p>
                  Alguns links para produtos em nosso site são links de afiliados. Isso significa que, quando você clica em um link e faz uma compra, podemos receber uma pequena comissão da loja parceira (como Amazon, Mercado Livre, Magazine Luiza, entre outras), sem nenhum custo adicional para você.
                </p>
                <p>
                  <strong>Importante:</strong> A presença de links de afiliados ou publicidade NÃO influencia nossas avaliações, opiniões ou recomendações. Nosso compromisso é sempre com a verdade e a utilidade para nossos leitores. Avaliamos produtos com base em seus méritos reais, independentemente de haver ou não compensação financeira envolvida.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Produtos Patrocinados</h3>
                <p>
                  Ocasionalmente, podemos publicar conteúdo patrocinado ou análises de produtos enviados por fabricantes. Quando isso ocorrer, será claramente identificado no início do artigo com a etiqueta "Conteúdo Patrocinado" ou "Produto Cedido para Análise". Mesmo nesses casos, mantemos total independência editorial e honestidade em nossas avaliações.
                </p>
              </section>

              <section>
                <h2 className="font-headline">Política de Privacidade e Cookies</h2>
                <p>
                  O ReviewLar utiliza cookies e tecnologias de rastreamento para melhorar sua experiência de navegação e exibir anúncios relevantes. Para saber mais sobre como coletamos, usamos e protegemos seus dados, consulte nossa <Link href="/politica-de-privacidade" className="text-primary hover:underline">Política de Privacidade</Link> completa.
                </p>
                <p>
                  Utilizamos o Google AdSense, que pode coletar e usar dados para personalização de anúncios. Você pode gerenciar suas preferências de anúncios através das <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Configurações de Anúncios do Google</a>.
                </p>
              </section>

              <section>
                <h2 className="font-headline">Nossa Equipe</h2>
                <p>
                  O ReviewLar é mantido por uma pequena equipe de entusiastas de tecnologia e redação, liderada por Alex Silva, nosso fundador e editor-chefe. Somos apaixonados por testar, comparar e descobrir os melhores produtos para tornar o seu lar mais prático e confortável.
                </p>
                <p>
                  <strong>Alex Silva</strong> - Fundador e Editor-Chefe: Com mais de 10 anos de experiência em análise de produtos e tecnologia, Alex lidera a equipe na busca pelos melhores eletrodomésticos do mercado brasileiro.
                </p>
              </section>
              
              <section>
                <h2 className="font-headline">Entre em Contato</h2>
                <p>
                  Adoramos ouvir nossos leitores! Se você tem alguma dúvida, sugestão de produto para analisarmos, questões sobre nossas políticas ou qualquer feedback, por favor, <Link href="/contato" className="text-primary hover:underline">entre em contato conosco</Link>.
                </p>
                <p>
                  <strong>E-mail:</strong> contato@reviewlar.com.br<br />
                  <strong>Tempo de Resposta:</strong> Respondemos todas as mensagens em até 48 horas úteis.
                </p>
                <p>
                  Sua opinião é fundamental para melhorarmos o ReviewLar a cada dia.
                </p>
              </section>

              <section className="text-sm text-muted-foreground border-t pt-6 mt-8">
                <p>
                  <strong>Última atualização:</strong> Novembro de 2024
                </p>
                <p>
                  ReviewLar © 2024. Todos os direitos reservados. As marcas e logotipos de produtos mencionados são propriedade de seus respectivos proprietários.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}