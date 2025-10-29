import Link from 'next/link';

export default function TermsOfUsePage() {
  const lastUpdated = "24 de Julho de 2024";

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <header className="not-prose text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-headline font-bold">Termos de Uso</h1>
                <p className="mt-4 text-lg text-muted-foreground">Última atualização: {lastUpdated}</p>
            </header>

            <section>
                <h2>1. Aceitação dos Termos</h2>
                <p>
                    Ao acessar e utilizar o site ReviewLar ("Site"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte dos termos, não deve usar nosso Site. O uso continuado do Site após quaisquer alterações constitui sua aceitação dos novos termos.
                </p>
            </section>
            
            <section>
                <h2>2. Descrição do Serviço</h2>
                <p>
                    O ReviewLar fornece análises, reviews, comparativos e guias de compra sobre eletrodomésticos e produtos para o lar. Nosso conteúdo é puramente informativo e educacional, destinado a auxiliar os consumidores em suas decisões de compra.
                </p>
            </section>
            
            <section>
                <h2>3. Uso Aceitável</h2>
                <p>
                    Você concorda em não usar o Site para qualquer finalidade ilegal ou proibida por estes Termos. É estritamente proibido:
                </p>
                <ul>
                    <li>Enviar spam ou qualquer forma de comunicação não solicitada.</li>
                    <li>Publicar ou transmitir qualquer conteúdo que seja ilegal, ameaçador, difamatório ou obsceno.</li>
                    <li>Tentar obter acesso não autorizado aos nossos sistemas ou redes.</li>
                    <li>Interferir no bom funcionamento do Site.</li>
                </ul>
            </section>
            
            <section>
                <h2>4. Propriedade Intelectual</h2>
                <p>
                    Todo o conteúdo presente no ReviewLar, incluindo textos, gráficos, logos, imagens e software, é de propriedade exclusiva do Site ou de seus criadores de conteúdo e é protegido pelas leis de direitos autorais do Brasil e internacionais. A cópia, reprodução, ou redistribuição de qualquer material sem autorização prévia por escrito é estritamente proibida.
                </p>
            </section>

            <section>
                <h2>5. Links Externos e de Afiliados</h2>
                <p>
                    Nosso Site pode conter links para sites de terceiros, incluindo links de afiliados. Isso significa que, se você clicar em um link e realizar uma compra, podemos receber uma comissão sem custo adicional para você.
                </p>
                <p>
                    Não temos controle e não nos responsabilizamos pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites de terceiros. Aconselhamos que você leia os termos e políticas de qualquer site que visitar.
                </p>
            </section>
            
            <section>
                <h2>6. Disclaimer sobre os Reviews</h2>
                <p>
                    As análises e reviews publicados no ReviewLar são baseados em nossa pesquisa, testes (quando aplicável) e opinião da nossa equipe editorial. Embora nos esforcemos para fornecer informações precisas e atualizadas, não garantimos que todas as informações estejam sempre corretas ou completas. As informações sobre produtos, como preços e disponibilidade, podem mudar rapidamente.
                </p>
                <p>
                    Nossas análises não substituem a sua avaliação pessoal do produto. Recomendamos que você sempre verifique as especificações e condições diretamente no site do vendedor antes de efetuar uma compra.
                </p>
            </section>

            <section>
                <h2>7. Limitação de Responsabilidade</h2>
                <p>
                    O ReviewLar não se responsabiliza por quaisquer perdas ou danos, diretos ou indiretos, resultantes de suas decisões de compra ou do uso das informações contidas em nosso Site. O uso do nosso conteúdo é por sua conta e risco. Não oferecemos garantias de qualquer tipo, expressas ou implícitas, sobre a operação do site ou as informações, conteúdos ou produtos incluídos.
                </p>
            </section>

            <section>
                <h2>8. Publicidade</h2>
                <p>
                    Este Site exibe anúncios de terceiros, como o Google AdSense. Não controlamos o conteúdo desses anúncios e não endossamos os produtos ou serviços anunciados. Sua interação com qualquer anúncio é de sua inteira responsabilidade.
                </p>
            </section>

            <section>
                <h2>9. Modificações dos Termos</h2>
                <p>
                    Reservamo-nos o direito de alterar ou substituir estes Termos de Uso a qualquer momento, a nosso exclusivo critério. A data da "última atualização" no topo desta página indicará quando as revisões foram feitas.
                </p>
            </section>

            <section>
                <h2>10. Lei Aplicável</h2>
                <p>
                    Estes Termos de Uso são regidos e interpretados de acordo com as leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo, SP, para dirimir quaisquer litígios decorrentes destes termos.
                </p>
            </section>

            <section>
                <h2>11. Contato</h2>
                <p>
                    Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco através do e-mail: <strong>contato@reviewlar.site</strong>.
                </p>
            </section>

        </div>
      </div>
    </main>
  );
}
