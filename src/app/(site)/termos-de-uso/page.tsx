import Link from 'next/link';

export default function TermsOfUsePage() {
  const lastUpdated = "21 de Novembro de 2024";

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
                <p>
                    <strong>Proprietário do Site:</strong> Alex Silva<br />
                    <strong>E-mail de Contato:</strong> contato@reviewlar.site<br />
                    <strong>Localização:</strong> Rio de Janeiro, Brasil
                </p>
            </section>
            
            <section>
                <h2>3. Uso Aceitável</h2>
                <p>
                    Você concorda em não usar o Site para qualquer finalidade ilegal ou proibida por estes Termos. É estritamente proibido:
                </p>
                <ul>
                    <li>Enviar spam ou qualquer forma de comunicação não solicitada.</li>
                    <li>Publicar ou transmitir qualquer conteúdo que seja ilegal, ameaçador, difamatório, obsceno ou que viole direitos de terceiros.</li>
                    <li>Tentar obter acesso não autorizado aos nossos sistemas ou redes.</li>
                    <li>Interferir no bom funcionamento do Site ou comprometer sua segurança.</li>
                    <li>Utilizar o Site para disseminar malware, vírus ou qualquer código malicioso.</li>
                    <li>Violar direitos de propriedade intelectual do Site ou de terceiros.</li>
                </ul>
            </section>
            
            <section>
                <h2>4. Propriedade Intelectual</h2>
                <p>
                    Todo o conteúdo presente no ReviewLar, incluindo textos, gráficos, logos, imagens, vídeos e software, é de propriedade exclusiva do Site ou de seus criadores de conteúdo e é protegido pelas leis de direitos autorais do Brasil e internacionais (Lei nº 9.610/98).
                </p>
                <p>
                    A cópia, reprodução, distribuição, modificação ou redistribuição de qualquer material sem autorização prévia por escrito é estritamente proibida. Você pode visualizar e imprimir páginas do Site apenas para uso pessoal e não comercial.
                </p>
                <p>
                    As marcas comerciais, logos e marcas de serviço mencionadas no Site são propriedade de seus respectivos proprietários. A menção de marcas de terceiros é feita apenas para fins informativos e de identificação de produtos.
                </p>
            </section>

            <section>
                <h2>5. Divulgação de Publicidade e Links de Afiliados</h2>
                <h3>5.1 Programa de Publicidade</h3>
                <p>
                    O ReviewLar participa de programas de publicidade, incluindo o Google AdSense, que exibe anúncios em nosso Site. Esses anúncios são fornecidos por terceiros e podem usar cookies e tecnologias de rastreamento para personalizar o conteúdo dos anúncios com base em seus interesses de navegação.
                </p>
                <p>
                    Não controlamos o conteúdo dos anúncios exibidos e não endossamos necessariamente os produtos ou serviços anunciados. Sua interação com qualquer anúncio é de sua inteira responsabilidade.
                </p>
                
                <h3>5.2 Links de Afiliados</h3>
                <p>
                    Nosso Site contém links de afiliados para produtos e serviços de terceiros. Quando você clica em um desses links e realiza uma compra, podemos receber uma comissão da loja parceira (como Amazon, Mercado Livre, Magazine Luiza, entre outras), sem nenhum custo adicional para você.
                </p>
                <p>
                    <strong>Importante:</strong> A presença de links de afiliados NÃO influencia nossas avaliações, opiniões ou recomendações. Mantemos independência editorial e avaliamos produtos com base em seus méritos reais, independentemente de compensação financeira.
                </p>
                
                <h3>5.3 Conteúdo Patrocinado</h3>
                <p>
                    Ocasionalmente, podemos publicar conteúdo patrocinado ou análises de produtos enviados por fabricantes. Todo conteúdo patrocinado será claramente identificado como tal no início do artigo. Mesmo nesses casos, mantemos total independência editorial.
                </p>
            </section>

            <section>
                <h2>6. Links Externos</h2>
                <p>
                    Nosso Site pode conter links para sites de terceiros. Esses links são fornecidos apenas para sua conveniência e não significam que endossamos o conteúdo desses sites.
                </p>
                <p>
                    Não temos controle e não nos responsabilizamos pelo conteúdo, políticas de privacidade, práticas de coleta de dados ou segurança de quaisquer sites de terceiros. Ao clicar em um link externo, você sai do nosso Site e assume os riscos associados ao acesso a sites de terceiros.
                </p>
                <p>
                    Aconselhamos que você leia os termos de uso e políticas de privacidade de qualquer site que visitar.
                </p>
            </section>
            
            <section>
                <h2>7. Isenção de Responsabilidade sobre Reviews</h2>
                <p>
                    As análises e reviews publicados no ReviewLar são baseados em nossa pesquisa, testes práticos (quando aplicável), especificações técnicas e opinião da nossa equipe editorial. Embora nos esforcemos para fornecer informações precisas, atualizadas e imparciais, não garantimos que todas as informações estejam sempre corretas, completas ou livres de erros.
                </p>
                <p>
                    As informações sobre produtos, incluindo preços, disponibilidade, especificações técnicas e características, podem mudar rapidamente e sem aviso prévio. Os preços mencionados são apenas referenciais e podem variar conforme a loja, localização e promoções vigentes.
                </p>
                <p>
                    <strong>Nossas análises não substituem a sua avaliação pessoal do produto.</strong> Recomendamos fortemente que você sempre:
                </p>
                <ul>
                    <li>Verifique as especificações completas diretamente no site do fabricante ou vendedor</li>
                    <li>Leia múltiplas avaliações de diferentes fontes</li>
                    <li>Confirme preços, condições de pagamento e políticas de devolução antes de comprar</li>
                    <li>Considere suas necessidades pessoais e orçamento</li>
                </ul>
            </section>

            <section>
                <h2>8. Limitação de Responsabilidade</h2>
                <p>
                    O ReviewLar e seus proprietários, funcionários, parceiros e afiliados não se responsabilizam por quaisquer perdas, danos, prejuízos ou despesas, diretos ou indiretos, resultantes de:
                </p>
                <ul>
                    <li>Suas decisões de compra baseadas em nosso conteúdo</li>
                    <li>Uso ou incapacidade de usar as informações contidas em nosso Site</li>
                    <li>Erros, imprecisões ou omissões em nosso conteúdo</li>
                    <li>Interrupções, falhas técnicas ou indisponibilidade do Site</li>
                    <li>Conteúdo ou conduta de terceiros no Site ou através de links externos</li>
                    <li>Perda de dados ou lucros decorrentes do uso do Site</li>
                </ul>
                <p>
                    O Site é fornecido "no estado em que se encontra" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas, incluindo, mas não se limitando a, garantias de comercialização, adequação a um propósito específico ou não violação.
                </p>
                <p>
                    O uso do nosso conteúdo é por sua conta e risco. Em nenhuma circunstância nossa responsabilidade total excederá o valor pago por você (se houver) para acessar o Site.
                </p>
            </section>

            <section>
                <h2>9. Cookies e Tecnologias de Rastreamento</h2>
                <p>
                    O ReviewLar utiliza cookies e tecnologias similares para melhorar sua experiência de navegação, analisar o tráfego do Site e exibir anúncios personalizados. Isso inclui cookies de terceiros do Google AdSense e outras plataformas de publicidade.
                </p>
                <p>
                    Ao continuar navegando em nosso Site, você concorda com o uso de cookies conforme descrito em nossa <Link href="/politica-de-privacidade">Política de Privacidade</Link>. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador ou das <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Configurações de Anúncios do Google</a>.
                </p>
            </section>

            <section>
                <h2>10. Privacidade e Proteção de Dados</h2>
                <p>
                    A coleta, uso e proteção de seus dados pessoais são regidos por nossa <Link href="/politica-de-privacidade">Política de Privacidade</Link>, que está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                </p>
                <p>
                    Ao usar o Site, você reconhece que leu e compreendeu nossa Política de Privacidade e concorda com as práticas de coleta e uso de dados nela descritas.
                </p>
            </section>

            <section>
                <h2>11. Modificações do Site e dos Termos</h2>
                <p>
                    Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do Site a qualquer momento, sem aviso prévio. Também podemos alterar ou substituir estes Termos de Uso a nosso exclusivo critério.
                </p>
                <p>
                    A data da "última atualização" no topo desta página indicará quando as revisões foram feitas. Alterações substanciais serão notificadas através de aviso destacado no Site ou por e-mail (quando aplicável).
                </p>
                <p>
                    O uso continuado do Site após qualquer modificação constitui sua aceitação dos termos revisados. Recomendamos que você revise periodicamente esta página.
                </p>
            </section>

            <section>
                <h2>12. Indenização</h2>
                <p>
                    Você concorda em indenizar, defender e isentar o ReviewLar, seus proprietários, funcionários, parceiros e afiliados de qualquer reivindicação, perda, responsabilidade, dano, custo ou despesa (incluindo honorários advocatícios) decorrentes de:
                </p>
                <ul>
                    <li>Seu uso do Site</li>
                    <li>Violação destes Termos de Uso</li>
                    <li>Violação de direitos de terceiros</li>
                    <li>Qualquer conteúdo que você envie ou publique no Site</li>
                </ul>
            </section>

            <section>
                <h2>13. Separabilidade</h2>
                <p>
                    Se qualquer disposição destes Termos for considerada inválida ou inexequível por uma autoridade competente, tal disposição será limitada ou eliminada na medida mínima necessária, e as demais disposições permanecerão em pleno vigor e efeito.
                </p>
            </section>

            <section>
                <h2>14. Lei Aplicável e Jurisdição</h2>
                <p>
                    Estes Termos de Uso são regidos e interpretados de acordo com as leis da República Federativa do Brasil, especialmente o Código de Defesa do Consumidor (Lei nº 8.078/90), a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e o Marco Civil da Internet (Lei nº 12.965/2014).
                </p>
                <p>
                    Fica eleito o foro da comarca de Rio de Janeiro, RJ, para dirimir quaisquer litígios decorrentes destes termos, renunciando as partes a qualquer outro, por mais privilegiado que seja.
                </p>
            </section>

            <section>
                <h2>15. Contato</h2>
                <p>
                    Se você tiver alguma dúvida, preocupação ou solicitação sobre estes Termos de Uso, entre em contato conosco:
                </p>
                <p>
                    <strong>E-mail:</strong> contato@reviewlar.site<br />
                    <strong>Tempo de Resposta:</strong> Até 48 horas úteis
                </p>
                <p>
                    Para questões relacionadas à privacidade e proteção de dados, consulte nossa <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
                </p>
            </section>

            <div className="not-prose bg-muted/50 p-6 rounded-lg mt-8">
                <p className="text-sm text-muted-foreground mb-0">
                    <strong>Nota:</strong> Ao utilizar o ReviewLar, você declara ter lido, compreendido e concordado com todos os termos e condições aqui estabelecidos, bem como com nossa Política de Privacidade.
                </p>
            </div>

        </div>
      </div>
    </main>
  );
}