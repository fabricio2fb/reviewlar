import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const lastUpdated = "24 de Julho de 2024";

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <header className="not-prose text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-headline font-bold">Política de Privacidade</h1>
                <p className="mt-4 text-lg text-muted-foreground">Última atualização: {lastUpdated}</p>
            </header>

            <section>
                <h2>1. Introdução</h2>
                <p>
                    Bem-vindo ao ReviewLar. A sua privacidade é de extrema importância para nós. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você visita nosso site.
                </p>
                <p>
                    Nosso compromisso é proteger os dados dos nossos usuários em conformidade com as leis aplicáveis, incluindo a Lei Geral de Proteção de Dados (LGPD) do Brasil.
                </p>
            </section>
            
            <section>
                <h2>2. Dados Coletados</h2>
                <h3>Dados de Navegação</h3>
                <p>
                    Quando você acessa o ReviewLar, podemos coletar automaticamente informações sobre seu dispositivo e navegação, como:
                </p>
                <ul>
                    <li>Endereço de IP (Protocolo de Internet)</li>
                    <li>Tipo de navegador e versão</li>
                    <li>Sistema operacional e tipo de dispositivo</li>
                    <li>Páginas que você visita em nosso site e o tempo gasto nelas</li>
                    <li>Datas e horários de acesso</li>
                </ul>

                <h3>Cookies e Tecnologias Similares</h3>
                <p>
                    Utilizamos cookies para melhorar sua experiência. Cookies são pequenos arquivos de texto que um site armazena no seu computador ou dispositivo móvel quando você o visita. Eles nos ajudam a lembrar suas preferências e a entender como você usa o site.
                </p>
            </section>

            <section>
                <h2>3. Google AdSense e Publicidade</h2>
                <p>
                    Este site utiliza o Google AdSense, um serviço de publicidade fornecido pelo Google. Para exibir anúncios relevantes para você, o Google e seus parceiros podem usar cookies.
                </p>
                <ul>
                    <li>
                        <strong>Cookie DoubleClick DART:</strong> O Google utiliza o cookie DART para exibir anúncios com base nas suas visitas ao nosso e a outros sites na Internet. Você pode desativar o uso do cookie DART visitando a página de política de privacidade da rede de conteúdo e de anúncios do Google.
                    </li>
                    <li>
                        <strong>Personalização de Anúncios:</strong> Os anúncios exibidos podem ser personalizados com base em seus interesses, dados demográficos e outras informações coletadas.
                    </li>
                </ul>
                <p>
                    Para mais informações sobre como o Google utiliza os dados, visite: <Link href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</Link>.
                </p>
                <p>
                    Você pode optar por não receber publicidade personalizada visitando a página de Configurações de Anúncios do Google: <Link href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">https://adssettings.google.com</Link>.
                </p>
            </section>

             <section>
                <h2>4. Cookies de Terceiros</h2>
                <p>
                    Além dos cookies do Google AdSense, outras redes de publicidade de terceiros também podem usar cookies para medir a eficácia de seus anúncios e personalizar o conteúdo que você vê. Não temos acesso ou controle sobre esses cookies.
                </p>
                <p>
                    Você pode gerenciar e desativar cookies através das configurações do seu navegador. Consulte a documentação do seu navegador para obter instruções.
                </p>
            </section>

            <section>
                <h2>5. Uso das Informações</h2>
                <p>
                    As informações que coletamos são usadas para os seguintes fins:
                </p>
                <ul>
                    <li>Operar e manter nosso site;</li>
                    <li>Melhorar, personalizar e expandir nosso site;</li>
                    <li>Entender e analisar como você usa nosso site;</li>
                    <li>Desenvolver novos produtos, serviços, recursos e funcionalidades;</li>
                    <li>Exibir conteúdo e anúncios personalizados.</li>
                </ul>
            </section>

            <section>
                <h2>6. Compartilhamento de Dados</h2>
                <p>
                    Não vendemos suas informações pessoais. Podemos compartilhar dados não pessoais e agregados com parceiros, como o Google, para fins de publicidade e análise, conforme descrito nesta política.
                </p>
            </section>

            <section>
                <h2>7. Direitos dos Usuários (LGPD)</h2>
                <p>
                    De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de:
                </p>
                <ul>
                    <li><strong>Acessar</strong> seus dados pessoais que possuímos.</li>
                    <li><strong>Corrigir</strong> dados incompletos, inexatos ou desatualizados.</li>
                    <li><strong>Solicitar a anonimização, bloqueio ou exclusão</strong> de dados desnecessários ou excessivos.</li>
                    <li><strong>Revogar seu consentimento</strong> a qualquer momento.</li>
                </ul>
                <p>
                    Para exercer seus direitos, entre em contato conosco através do e-mail disponibilizado na seção "Contato".
                </p>
            </section>

            <section>
                <h2>8. Segurança dos Dados</h2>
                <p>
                    A segurança de seus dados é uma prioridade. Empregamos medidas de segurança administrativa, técnica e física para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>
            </section>
            
            <section>
                <h2>9. Alterações nesta Política</h2>
                <p>
                    Reservamo-nos o direito de atualizar esta política de privacidade a qualquer momento. Quando o fizermos, atualizaremos a data da "última atualização" no topo desta página. Encorajamos os usuários a verificar esta página frequentemente para quaisquer alterações.
                </p>
            </section>

            <section>
                <h2>10. Contato</h2>
                <p>
                    Se você tiver alguma dúvida sobre esta Política de Privacidade ou sobre nossas práticas, entre em contato conosco pelo e-mail: <strong>contato@reviewlar.site</strong>.
                </p>
            </section>
        </div>
      </div>
    </main>
  );
}
