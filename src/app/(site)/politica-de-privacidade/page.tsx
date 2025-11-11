import Link from 'next/link';
import { Shield, Cookie, Lock, AlertCircle, Eye, Users, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "10 de Novembro de 2025";

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-4xl md:text-6xl font-headline font-bold">Política de Privacidade</h1>
                <p className="mt-4 text-lg text-muted-foreground">Última atualização: {lastUpdated}</p>
            </header>

            {/* Alert Box */}
            <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
                <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-blue-900 dark:text-blue-100 text-lg mb-2">
                            📋 Resumo Executivo
                        </h3>
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                            Sua privacidade é importante para nós. Coletamos dados básicos de navegação e usamos cookies para melhorar sua experiência. Participamos de programas de afiliados e exibimos anúncios do Google AdSense. Você tem controle total sobre seus dados conforme a LGPD.
                        </p>
                    </div>
                </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">

            {/* Section 1 */}
            <section className="bg-card rounded-xl p-8 shadow-sm border">
                <div className="flex items-center gap-3 mb-4 not-prose">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold m-0">1. Introdução</h2>
                </div>
                <p>
                    Bem-vindo ao <strong>Reviewlar</strong>. A sua privacidade é de extrema importância para nós. Esta Política de Privacidade explica de forma clara e transparente como coletamos, usamos, divulgamos e protegemos suas informações quando você visita nosso site.
                </p>
                <p>
                    Nosso compromisso é proteger os dados dos nossos usuários em total conformidade com as leis aplicáveis, incluindo a <strong>Lei Geral de Proteção de Dados (LGPD)</strong> do Brasil (Lei nº 13.709/2018) e as melhores práticas internacionais de privacidade.
                </p>
                <p>
                    Ao usar nosso site, você concorda com a coleta e uso de informações de acordo com esta política.
                </p>
            </section>
            
            {/* Section 2 */}
            <section className="bg-card rounded-xl p-8 shadow-sm border">
                <div className="flex items-center gap-3 mb-4 not-prose">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold m-0">2. Dados Coletados</h2>
                </div>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Dados de Navegação (Coletados Automaticamente)</h3>
                <p>
                    Quando você acessa o Reviewlar, coletamos automaticamente informações sobre seu dispositivo e navegação para melhorar sua experiência e garantir o funcionamento adequado do site:
                </p>
                <ul>
                    <li><strong>Endereço de IP (Protocolo de Internet)</strong> - Para identificar sua localização geral e prevenir fraudes</li>
                    <li><strong>Tipo de navegador e versão</strong> - Para otimizar a exibição do site</li>
                    <li><strong>Sistema operacional e tipo de dispositivo</strong> - Para garantir compatibilidade</li>
                    <li><strong>Páginas que você visita</strong> e o tempo gasto nelas - Para entender o interesse dos usuários</li>
                    <li><strong>Datas e horários de acesso</strong> - Para análise de tráfego</li>
                    <li><strong>URL de referência</strong> - Para saber como você chegou ao nosso site</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Dados Fornecidos Voluntariamente</h3>
                <p>
                    Se você entrar em contato conosco ou se inscrever para receber atualizações, coletamos:
                </p>
                <ul>
                    <li>Nome (se fornecido)</li>
                    <li>Endereço de e-mail</li>
                    <li>Mensagem ou comentário</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Cookies e Tecnologias Similares</h3>
                <p>
                    Utilizamos <strong>cookies</strong> para melhorar sua experiência de navegação. Cookies são pequenos arquivos de texto que um site armazena no seu computador ou dispositivo móvel quando você o visita. Eles nos ajudam a:
                </p>
                <ul>
                    <li>Lembrar suas preferências (como idioma e tema)</li>
                    <li>Entender como você usa o site</li>
                    <li>Personalizar conteúdo e anúncios</li>
                    <li>Analisar o desempenho do site</li>
                </ul>
            </section>

            {/* Section 3 - Google AdSense */}
            <section className="bg-amber-50 dark:bg-amber-950 rounded-xl p-8 shadow-sm border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3 mb-4 not-prose">
                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                        <Cookie className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold m-0 text-amber-900 dark:text-amber-100">3. Google AdSense e Publicidade</h2>
                </div>
                <p className="text-amber-900 dark:text-amber-100">
                    <strong>Este site utiliza o Google AdSense</strong>, um serviço de publicidade fornecido pelo Google LLC. Esta é uma das principais formas de manter o site funcionando e oferecer conteúdo gratuito para você.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 text-amber-900 dark:text-amber-100">Como funciona:</h3>
                <ul className="text-amber-900 dark:text-amber-100">
                    <li>
                        <strong>Cookie DoubleClick DART:</strong> O Google utiliza o cookie DART para exibir anúncios com base nas suas visitas ao nosso site e a outros sites na Internet. Este cookie ajuda a personalizar os anúncios que você vê.
                    </li>
                    <li>
                        <strong>Personalização de Anúncios:</strong> Os anúncios exibidos podem ser personalizados com base em seus interesses, dados demográficos, histórico de navegação e outras informações coletadas pelo Google.
                    </li>
                    <li>
                        <strong>Parceiros de Publicidade:</strong> Empresas parceiras do Google também podem usar cookies para medir a eficácia de seus anúncios.
                    </li>
                </ul>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mt-6">
                    <p className="text-gray-900 dark:text-gray-100 font-semibold mb-3">🔗 Links importantes do Google:</p>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                        <li>
                            <strong>Política de Privacidade do Google:</strong>{' '}
                            <Link href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                https://policies.google.com/privacy
                            </Link>
                        </li>
                        <li>
                            <strong>Como o Google usa dados de publicidade:</strong>{' '}
                            <Link href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                https://policies.google.com/technologies/ads
                            </Link>
                        </li>
                        <li>
                            <strong>Desativar personalização de anúncios:</strong>{' '}
                            <Link href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                                https://adssettings.google.com
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>

             {/* Section 4 - Affiliate Links */}
            <section className="bg-card rounded-xl p-8 shadow-sm border">
                <div className="flex items-center gap-3 mb-4 not-prose">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold m-0">4. Programas de Afiliados</h2>
                </div>
                <p>
                    O Reviewlar participa de <strong>programas de afiliados</strong> da Amazon, Magazine Luiza, Mercado Livre e outras plataformas de e-commerce. Isso significa que:
                </p>
                <ul>
                    <li>Alguns links em nossos reviews são links de afiliados</li>
                    <li>Quando você clica e faz uma compra, podemos receber uma comissão sem custo adicional para você</li>
                    <li>Essas comissões nos ajudam a manter o site funcionando</li>
                    <li>Nossas avaliações permanecem honestas e imparciais</li>
                </ul>
                <p>
                    Para mais informações detalhadas sobre nossa política de afiliados, consulte nossa{' '}
                    <Link href="/divulgacao-de-afiliados" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                        Divulgação de Afiliados
                    </Link>.
                </p>
            </section>

             <section className="bg-card rounded-xl p-8 shadow-sm border">
                <h2>5. Cookies de Terceiros</h2>
                <p>
                    Além dos cookies do Google AdSense, outras redes de publicidade de terceiros e ferramentas de análise também podem usar cookies em nosso site para:
                </p>
                <ul>
                    <li>Medir a eficácia de seus anúncios</li>
                    <li>Personalizar o conteúdo que você vê</li>
                    <li>Analisar o tráfego do site</li>
                </ul>
                <p>
                    <strong>Importante:</strong> Não temos acesso direto ou controle sobre esses cookies de terceiros. Recomendamos que você consulte as políticas de privacidade dessas empresas para obter mais informações.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Como gerenciar cookies:</h3>
                <p>
                    Você pode gerenciar e desativar cookies através das configurações do seu navegador:
                </p>
                <ul>
                    <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
                    <li><strong>Firefox:</strong> Opções → Privacidade e Segurança → Cookies</li>
                    <li><strong>Safari:</strong> Preferências → Privacidade → Gerenciar dados do site</li>
                    <li><strong>Edge:</strong> Configurações → Cookies e permissões do site</li>
                </ul>
                <p className="text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border-l-4 border-amber-500">
                    ⚠️ <strong>Aviso:</strong> Desativar cookies pode afetar a funcionalidade do site e sua experiência de navegação.
                </p>
            </section>

            <section className="bg-card rounded-xl p-8 shadow-sm border">
                <h2>6. Uso das Informações</h2>
                <p>
                    As informações que coletamos são usadas exclusivamente para os seguintes fins legítimos:
                </p>
                <ul>
                    <li><strong>Operar e manter nosso site</strong> - Garantir funcionamento adequado</li>
                    <li><strong>Melhorar, personalizar e expandir</strong> - Desenvolver novos recursos</li>
                    <li><strong>Entender e analisar</strong> - Compreender como os usuários interagem</li>
                    <li><strong>Desenvolver novos produtos e serviços</strong> - Criar conteúdo relevante</li>
                    <li><strong>Comunicar com você</strong> - Responder suas mensagens (se aplicável)</li>
                    <li><strong>Exibir anúncios personalizados</strong> - Através do Google AdSense</li>
                    <li><strong>Prevenir fraudes e abusos</strong> - Garantir segurança</li>
                </ul>
            </section>

            <section className="bg-card rounded-xl p-8 shadow-sm border">
                <h2>7. Compartilhamento de Dados</h2>
                <p>
                    <strong>Não vendemos suas informações pessoais.</strong> Nunca. Em nenhuma circunstância.
                </p>
                <p>
                    Podemos compartilhar dados nos seguintes casos:
                </p>
                <ul>
                    <li><strong>Com o Google:</strong> Dados não pessoais e agregados para fins de publicidade através do AdSense</li>
                    <li><strong>Com parceiros de afiliados:</strong> Apenas informação de cliques em links (sem dados pessoais identificáveis)</li>
                    <li><strong>Dados agregados e anônimos:</strong> Estatísticas gerais de uso do site que não identificam usuários individuais</li>
                    <li><strong>Por obrigação legal:</strong> Se exigido por lei, ordem judicial ou processo legal</li>
                </ul>
            </section>

            {/* Section 7 - LGPD Rights */}
            <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-8 shadow-sm border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4 not-prose">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold m-0 text-green-900 dark:text-green-100">8. Direitos dos Usuários (LGPD)</h2>
                </div>
                <p className="text-green-900 dark:text-green-100">
                    De acordo com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>, você possui os seguintes direitos em relação aos seus dados pessoais:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-5">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">✅ Direito de Acesso</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">Confirmar se tratamos seus dados e solicitar acesso a eles</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-5">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">✏️ Direito de Correção</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">Corrigir dados incompletos, inexatos ou desatualizados</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-5">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🗑️ Direito de Exclusão</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">Solicitar a exclusão de dados desnecessários ou tratados em desconformidade</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-5">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🔒 Direito de Anonimização</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">Solicitar anonimização ou bloqueio de dados</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-5">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📋 Direito à Portabilidade</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">Receber seus dados em formato estruturado e interoperável</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-5">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">⛔ Direito de Revogação</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">Revogar seu consentimento a qualquer momento</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mt-6">
                    <p className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                        📧 Como exercer seus direitos:
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        Entre em contato conosco através do e-mail <strong>contato@reviewlar.site</strong> com o assunto "LGPD - Solicitação de Direitos". Responderemos sua solicitação em até 15 dias úteis.
                    </p>
                </div>
            </section>

            <section className="bg-card rounded-xl p-8 shadow-sm border">
                <div className="flex items-center gap-3 mb-4 not-prose">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold m-0">9. Segurança dos Dados</h2>
                </div>
                <p>
                    A segurança de seus dados é uma prioridade absoluta. Implementamos diversas medidas de segurança para proteger suas informações:
                </p>
                <ul>
                    <li><strong>Criptografia SSL/TLS:</strong> Todas as comunicações entre seu navegador e nosso servidor são criptografadas</li>
                    <li><strong>Proteção contra acesso não autorizado:</strong> Controles de acesso rigorosos</li>
                    <li><strong>Monitoramento contínuo:</strong> Sistemas de detecção de intrusão</li>
                    <li><strong>Atualizações regulares:</strong> Manutenção constante de segurança</li>
                    <li><strong>Minimização de dados:</strong> Coletamos apenas o necessário</li>
                </ul>
                <p>
                    No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis de proteger suas informações, não podemos garantir segurança absoluta.
                </p>
            </section>

            <section className="bg-card rounded-xl p-8 shadow-sm border">
                <h2>10. Retenção de Dados</h2>
                <p>
                    Retemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção maior seja exigido ou permitido por lei.
                </p>
                <ul>
                    <li><strong>Dados de navegação:</strong> Mantidos por até 24 meses</li>
                    <li><strong>Cookies:</strong> Conforme configuração (geralmente de 1 mês a 2 anos)</li>
                    <li><strong>Dados de contato:</strong> Até resolução da solicitação ou consentimento revogado</li>
                </ul>
            </section>

            <section className="bg-card rounded-xl p-8 shadow-sm border">
                <h2>11. Privacidade de Menores</h2>
                <p>
                    Nosso site não é direcionado a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores. Se você é pai/mãe ou responsável e acredita que seu filho nos forneceu dados pessoais, entre em contato conosco para que possamos tomar as medidas apropriadas.
                </p>
            </section>

            <section className="bg-card rounded-xl p-8 shadow-sm border">
                <h2>12. Links para Sites de Terceiros</h2>
                <p>
                    Nosso site pode conter links para sites de terceiros (como lojas online em nossos reviews). Não somos responsáveis pelas práticas de privacidade ou pelo conteúdo desses sites. Recomendamos que você leia as políticas de privacidade de cada site que visita.
                </p>
            </section>
            
            <section className="bg-card rounded-xl p-8 shadow-sm border">
                <h2>13. Alterações nesta Política</h2>
                <p>
                    Reservamo-nos o direito de atualizar esta Política de Privacidade a qualquer momento para refletir mudanças em nossas práticas, legislação ou por outras razões operacionais, legais ou regulatórias.
                </p>
                <p>
                    Quando fizermos alterações significativas, atualizaremos a data da "última atualização" no topo desta página e, quando apropriado, notificaremos você por e-mail ou através de um aviso em destaque em nosso site.
                </p>
                <p>
                    Encorajamos os usuários a revisar esta política periodicamente para se manterem informados sobre como protegemos suas informações.
                </p>
            </section>

            <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-white">
                <h2 className="text-white">14. Contato e Encarregado de Dados</h2>
                <p>
                    Se você tiver alguma dúvida sobre esta Política de Privacidade, sobre nossas práticas de tratamento de dados, ou quiser exercer seus direitos sob a LGPD, entre em contato conosco:
                </p>
                <div className="bg-white/10 rounded-lg p-6 mt-4">
                    <ul className="space-y-2 text-white">
                        <li><strong>📧 E-mail:</strong> contato@reviewlar.site</li>
                        <li><strong>🌐 Site:</strong> <Link href="/" className="text-blue-300 hover:text-blue-200 underline">www.reviewlar.site</Link></li>
                        <li><strong>📍 Endereço:</strong> Brasil</li>
                    </ul>
                </div>
                <p className="mt-4">
                    Faremos o possível para responder sua solicitação no prazo de <strong>15 dias úteis</strong>.
                </p>
            </section>

            </div>

            {/* Document Info */}
            <div className="mt-12 text-center text-muted-foreground text-sm border-t pt-8">
                <p>Documento atualizado em: {lastUpdated}</p>
                <p className="mt-2">
                    Este documento está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)
                </p>
            </div>
        </div>
      </div>
    </main>
  );
}
