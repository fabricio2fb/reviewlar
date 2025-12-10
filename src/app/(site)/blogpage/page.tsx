"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link as LinkIcon, 
  ChevronRight, 
  Star, 
  Check, 
  ArrowRight,
  CheckCircle,
  Utensils,
  Share2
} from 'lucide-react';

export default function BlogPost() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000); // Reset visual apenas para demo
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <a href="#" className="hover:text-green-600 transition">Home</a>
            <ChevronRight size={16} className="mx-2 text-gray-400 flex-shrink-0" />
            <a href="#" className="hover:text-green-600 transition">Blog</a>
            <ChevronRight size={16} className="mx-2 text-gray-400 flex-shrink-0" />
            <a href="#" className="hover:text-green-600 transition">Receitas & Air Fryer</a>
            <ChevronRight size={16} className="mx-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-medium">5 Receitas saudáveis para Air Fryer</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content Column */}
          <article className="lg:w-2/3">
            
            {/* Header do Artigo */}
            <header className="mb-8">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold tracking-wider uppercase rounded-full mb-4">
                Receitas & Air Fryer
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                5 Receitas saudáveis para fazer na sua Air Fryer em menos de 15 minutos
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-b border-gray-200 pb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Ana Silva" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Ana Silva</p>
                    <p className="text-xs">Especialista em Culinária</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> 24 Nov, 2025
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> 5 min de leitura
                </div>
              </div>
            </header>

            {/* Imagem de Destaque */}
            <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Alimentos saudáveis na Air Fryer" 
                className="w-full h-auto object-cover"
              />
              <p className="text-center text-gray-500 text-xs mt-2 italic">
                A Air Fryer permite texturas crocantes sem o uso excessivo de óleo.
              </p>
            </div>

            {/* Conteúdo do Post (Simulando Rich Text) */}
            <div className="prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed">
              <p className="mb-6 text-xl text-gray-600 font-light">
                Se você comprou uma Air Fryer achando que só serviria para fazer batata frita congelada, prepare-se para mudar de ideia. A fritadeira elétrica é, na verdade, um forno de convecção super potente que pode transformar vegetais sem graça em acompanhamentos incríveis em minutos.
              </p>

              <p className="mb-6">
                Neste guia, separei minhas 5 receitas favoritas para quem quer manter a dieta em dia sem perder tempo na cozinha. O melhor? Nenhuma delas leva mais que 15 minutos.
              </p>

              {/* Box de Destaque / Dica */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
                <h4 className="flex items-center gap-2 font-bold text-green-800 text-lg mb-2">
                  <Utensils size={20} /> Dica de Chef
                </h4>
                <p className="text-green-900">
                  Para garantir a crocância máxima, nunca encha o cesto até o topo. O ar quente precisa circular entre os alimentos. Se necessário, faça em duas levas!
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Chips de Batata Doce Rústica</h2>
              <p className="mb-4">
                Uma alternativa perfeita aos salgadinhos industrializados. A batata doce é rica em fibras e tem baixo índice glicêmico.
              </p>
              <ul className="space-y-2 mb-6 ml-4">
                <li className="flex items-start gap-2"><Check size={18} className="text-green-500 mt-1 flex-shrink-0" /> <span>Corte a batata doce em rodelas bem finas (use um mandolim se tiver).</span></li>
                <li className="flex items-start gap-2"><Check size={18} className="text-green-500 mt-1 flex-shrink-0" /> <span>Tempere com páprica defumada, sal e um fio de azeite.</span></li>
                <li className="flex items-start gap-2"><Check size={18} className="text-green-500 mt-1 flex-shrink-0" /> <span>Asse a 180°C por 10-12 minutos, agitando o cesto na metade do tempo.</span></li>
              </ul>

              {/* Product Callout (CTA contextual) */}
              <div className="my-10 p-6 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                   <img src="https://placehold.co/150x150/e2e8f0/64748b?text=AirFryer" alt="Air Fryer Philco" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Usamos neste teste</span>
                  <h3 className="font-bold text-gray-900 text-lg">Air Fryer Philco Gourmet Black 4L</h3>
                  <p className="text-sm text-gray-500 mt-1">O modelo ideal para garantir crocância uniforme.</p>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition shadow-md whitespace-nowrap">
                    Ver Melhor Preço
                  </button>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Grão de Bico Crocante (Snack Proteico)</h2>
              <p className="mb-4">
                Sabe aquela vontade de comer algo crocante à tarde? Esse snack é pura proteína e muito fácil de fazer com grão de bico em conserva.
              </p>
              <p className="mb-4">
                Escorra bem o grão de bico e seque com papel toalha (esse passo é crucial!). Tempere com curry, cominho e sal. Leve à Air Fryer a 200°C por 12-15 minutos até ficarem bem dourados e fazendo barulho de "pedrinha" quando agita o cesto.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Conclusão</h2>
              <p className="mb-6">
                Ter uma alimentação saudável não significa passar horas na cozinha. Com os equipamentos certos e um pouco de criatividade, você transforma ingredientes simples em refeições deliciosas.
              </p>
              <p>
                Gostou dessas receitas? Não esqueça de compartilhar com aquele amigo que acabou de comprar uma Air Fryer!
              </p>
            </div>

            {/* Share Section */}
            <div className="border-t border-b border-gray-200 py-8 my-10">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="font-bold text-gray-900 flex items-center gap-2">
                  <Share2 size={20} /> Compartilhe este artigo:
                </span>
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition">
                    <Facebook size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition">
                    <Twitter size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition">
                    <Linkedin size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition">
                    <LinkIcon size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Author Bio Box */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Ana Silva" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Sobre Ana Silva</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Apaixonada por gastronomia e tecnologia, Ana testa eletrodomésticos há 5 anos. Seu objetivo é ajudar famílias a cozinharem melhor e mais rápido, sem gastar uma fortuna em equipamentos desnecessários.
                </p>
                <a href="#" className="text-green-600 font-medium text-sm hover:underline">
                  Ver todos os posts de Ana &rarr;
                </a>
              </div>
            </div>

          </article>

          {/* Sidebar (Sticky) */}
          <aside className="lg:w-1/3">
            <div className="sticky top-24 space-y-8">
              
              {/* Newsletter Widget */}
              <div className="bg-green-900 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-green-600 rounded-full opacity-20 blur-xl"></div>
                <h3 className="text-xl font-bold mb-2 relative z-10">Gostou das dicas?</h3>
                <p className="text-green-100 text-sm mb-4 relative z-10">
                  Receba mais receitas exclusivas para Air Fryer toda semana.
                </p>
                <form onSubmit={handleSubscribe} className="relative z-10 space-y-3">
                  <input 
                    type="email" 
                    placeholder="Seu e-mail" 
                    className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                  <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition shadow-md">
                    Quero receber
                  </button>
                </form>
                {isSubscribed && (
                  <div className="absolute inset-0 bg-green-800 flex items-center justify-center z-20 animate-in fade-in duration-300">
                    <div className="text-center">
                      <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                      <p className="font-bold">Inscrito com sucesso!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Table of Contents (Simulado) */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hidden lg:block">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider text-opacity-50">Neste Artigo</h3>
                <ul className="space-y-3 text-sm border-l-2 border-gray-100 pl-4">
                  <li><a href="#" className="text-green-600 font-medium border-l-2 border-green-600 -ml-[18px] pl-4 block">Introdução</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-600 transition block">1. Chips de Batata Doce</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-600 transition block">2. Grão de Bico Crocante</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-600 transition block">3. Frango à Passarinho</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-green-600 transition block">Conclusão</a></li>
                </ul>
              </div>

              {/* Related/Popular Products */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Melhores Air Fryers 2025</h3>
                <div className="space-y-4">
                  <a href="#" className="flex gap-4 group">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                       <img src="https://placehold.co/100x100/e2e8f0/64748b?text=Philco" alt="Miniatura" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 leading-tight">
                        Air Fryer Philco Gourmet Black
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-yellow-400 text-xs">
                          <Star size={10} fill="currentColor" />
                          <Star size={10} fill="currentColor" />
                          <Star size={10} fill="currentColor" />
                          <Star size={10} fill="currentColor" />
                          <Star size={10} fill="currentColor" />
                        </div>
                        <span className="text-xs text-gray-400">(450)</span>
                      </div>
                      <span className="text-green-600 font-bold text-sm mt-1 block">R$ 399,90</span>
                    </div>
                  </a>
                  
                  <a href="#" className="flex gap-4 group">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                       <img src="https://placehold.co/100x100/e2e8f0/64748b?text=Mondial" alt="Miniatura" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 leading-tight">
                        Mondial Family 4L Inox
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-yellow-400 text-xs">
                          <Star size={10} fill="currentColor" />
                          <Star size={10} fill="currentColor" />
                          <Star size={10} fill="currentColor" />
                          <Star size={10} fill="currentColor" />
                          <Star size={10} className="text-gray-300" fill="currentColor" />
                        </div>
                        <span className="text-xs text-gray-400">(320)</span>
                      </div>
                      <span className="text-green-600 font-bold text-sm mt-1 block">R$ 349,90</span>
                    </div>
                  </a>
                </div>
                <button className="w-full mt-6 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                  Ver ranking completo
                </button>
              </div>

            </div>
          </aside>
        </div>

        {/* Related Posts Row (Bottom) */}
        <section className="mt-20 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Você também pode gostar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <a key={item} href="#" className="group block">
                <div className="rounded-xl overflow-hidden mb-4 relative h-48">
                  <img 
                    src={`https://placehold.co/600x400/e2e8f0/64748b?text=Post+Relacionado+${item}`} 
                    alt="Post Relacionado" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition"></div>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition mb-2">
                  Como limpar sua Air Fryer corretamente para não descascar o teflon
                </h3>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  Ler artigo <ArrowRight size={14} />
                </span>
              </a>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}