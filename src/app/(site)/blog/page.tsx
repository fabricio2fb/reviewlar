"use client";

import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, Star, Utensils, Wrench, ShoppingCart, Leaf, CheckCircle } from 'lucide-react';

export default function BlogPage() {
  const [showToast, setShowToast] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans text-gray-800">
      
      {/* Hero Section: Featured Post */}
      <section className="mb-12">
        <div className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer h-96">
          <img 
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" 
            alt="Cozinha Moderna" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white max-w-3xl">
            <span className="inline-block px-3 py-1 bg-green-600 text-xs font-semibold tracking-wider uppercase rounded-full mb-3">
              Destaque
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight group-hover:text-green-100 transition">
              Como economizar até 30% de energia escolhendo os eletrodomésticos certos
            </h1>
            <p className="text-gray-200 text-lg mb-4 hidden md:block">
              Descubra como a classificação energética e as novas tecnologias inverter podem transformar sua conta de luz no final do mês.
            </p>
            <div className="flex items-center text-sm text-gray-300">
              <span className="mr-4 flex items-center gap-2">
                <Calendar size={16} /> 24 Nov, 2025
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} /> 5 min de leitura
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Article Grid */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-green-600 pl-3">
              Últimas do Blog
            </h2>
            
            {/* Filter/Sort Buttons */}
            <div className="hidden sm:flex gap-2">
              <button className="px-3 py-1 text-sm font-medium bg-green-600 text-white rounded-full">
                Tudo
              </button>
              <button className="px-3 py-1 text-sm font-medium bg-white text-gray-600 border border-gray-200 rounded-full hover:border-green-600 hover:text-green-600 transition">
                Dicas
              </button>
              <button className="px-3 py-1 text-sm font-medium bg-white text-gray-600 border border-gray-200 rounded-full hover:border-green-600 hover:text-green-600 transition">
                Receitas
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Post 1 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-green-700 text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                  Air Fryer
                </span>
                <img 
                  src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Receita Air Fryer" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                  5 Receitas saudáveis para fazer na sua Air Fryer em menos de 15 minutos
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                  Esqueça a fritura tradicional. Separamos receitas incríveis, desde chips de batata doce até frango crocante, sem usar óleo.
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Por Ana Silva</span>
                  <a href="#" className="text-green-600 font-semibold text-sm hover:underline flex items-center gap-1">
                    Ler mais <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </article>

            {/* Post 2 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                  Manutenção
                </span>
                <img 
                  src="https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Máquina de Lavar" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                  Sua máquina de lavar está cheirando mal? Veja como resolver
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                  O acúmulo de resíduos e sabão pode causar odores desagradáveis. Aprenda o passo a passo da limpeza de tambor.
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Por Carlos Eduardo</span>
                  <a href="#" className="text-green-600 font-semibold text-sm hover:underline flex items-center gap-1">
                    Ler mais <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </article>

            {/* Post 3 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-orange-600 text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                  Guia de Compra
                </span>
                <img 
                  src="https://images.unsplash.com/photo-1571175443880-49e1d58b794a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Geladeira Inox" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                  Inox vs. Evox vs. Branco: Qual acabamento dura mais?
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                  Entenda as diferenças técnicas entre os acabamentos de geladeiras e qual é o ideal para quem mora no litoral.
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Por Equipe ReviewLar</span>
                  <a href="#" className="text-green-600 font-semibold text-sm hover:underline flex items-center gap-1">
                    Ler mais <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </article>

            {/* Post 4 */}
            <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-purple-600 text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                  Tecnologia
                </span>
                <img 
                  src="https://images.unsplash.com/photo-1558002038-1091a1661729?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Casa Inteligente" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                  Vale a pena investir em eletrodomésticos com Wi-Fi?
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                  Controlar a máquina de lavar pelo celular é útil ou apenas luxo? Analisamos o custo-benefício da conectividade.
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Por Ana Silva</span>
                  <a href="#" className="text-green-600 font-semibold text-sm hover:underline flex items-center gap-1">
                    Ler mais <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </article>
          </div>

          {/* Load More Button */}
          <div className="mt-10 text-center">
            <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 hover:border-green-600 hover:text-green-600 transition duration-300 shadow-sm">
              Carregar mais artigos
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 space-y-8">
          
          {/* About Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Sobre o Blog</h3>
            <p className="text-gray-600 text-sm mb-4">
              O blog do ReviewLar é seu destino para dicas práticas de casa, manutenção de eletros e receitas testadas.
            </p>
            <a href="#" className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
              Conheça nossa equipe <ArrowRight size={14} />
            </a>
          </div>

          {/* Categories */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex justify-between items-center text-gray-600 hover:text-green-600 transition group">
                  <span className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
                    Receitas & Air Fryer
                  </span>
                  <span className="bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full text-xs group-hover:bg-green-50 group-hover:text-green-600">
                    12
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex justify-between items-center text-gray-600 hover:text-green-600 transition group">
                  <span className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
                    Manutenção
                  </span>
                  <span className="bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full text-xs group-hover:bg-green-50 group-hover:text-green-600">
                    8
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex justify-between items-center text-gray-600 hover:text-green-600 transition group">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
                    Guias de Compra
                  </span>
                  <span className="bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full text-xs group-hover:bg-green-50 group-hover:text-green-600">
                    15
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex justify-between items-center text-gray-600 hover:text-green-600 transition group">
                  <span className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-gray-400 group-hover:text-green-500" />
                    Economia de Energia
                  </span>
                  <span className="bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full text-xs group-hover:bg-green-50 group-hover:text-green-600">
                    5
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-green-900 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-green-600 rounded-full opacity-20 blur-xl"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Dicas semanais grátis</h3>
              <p className="text-green-100 text-sm mb-4">
                Receba os melhores reviews e receitas direto no seu e-mail. Sem spam.
              </p>
              <form className="space-y-3" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  required 
                />
                <button 
                  type="submit" 
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition shadow-lg"
                >
                  Inscrever-se
                </button>
              </form>
            </div>
          </div>

          {/* Popular Products Mini-Review */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Mais Buscados</h3>
            <div className="space-y-4">
              <a href="#" className="flex gap-4 group">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img src="https://placehold.co/100x100/e2e8f0/64748b?text=AirFry" alt="Miniatura" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 leading-tight">
                    Air Fryer Philco Gourmet Black 4L
                  </h4>
                  <div className="flex text-yellow-400 text-xs mt-1 gap-0.5">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} className="text-yellow-400" />
                  </div>
                </div>
              </a>
              <a href="#" className="flex gap-4 group">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img src="https://placehold.co/100x100/e2e8f0/64748b?text=Lava" alt="Miniatura" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 leading-tight">
                    Lava e Seca Midea HealthGuard
                  </h4>
                  <div className="flex text-yellow-400 text-xs mt-1 gap-0.5">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-5 right-5 bg-green-900 text-white px-6 py-4 rounded-lg shadow-xl transition-all duration-300 z-50 flex items-center gap-3 ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <CheckCircle className="text-green-500 text-xl" />
        <div>
          <h4 className="font-bold text-sm">Sucesso!</h4>
          <p className="text-xs text-green-100">Você foi inscrito na nossa newsletter.</p>
        </div>
      </div>
    </main>
  );
}