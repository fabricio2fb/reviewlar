'use client';

import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import type { Offer } from '@/lib/types';

type FloatingBuyButtonProps = {
  offers: Offer[];
  productName: string;
};

export default function FloatingBuyButton({ offers, productName }: FloatingBuyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-40 lg:hidden"
        aria-label="Ver ofertas de compra"
      >
        <ShoppingCart size={28} />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {offers.length}
        </span>
      </button>

      {/* Overlay escuro */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Painel deslizante */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-card rounded-t-3xl shadow-2xl transform transition-transform duration-300 z-50 max-h-[85vh] overflow-y-auto lg:hidden ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header do painel */}
        <div className="sticky top-0 bg-white dark:bg-card border-b px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Onde Comprar</h3>
            <p className="text-sm text-muted-foreground">Escolha a melhor oferta</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X size={24} className="text-muted-foreground" />
          </button>
        </div>

        {/* Lista de ofertas */}
        <div className="p-4 space-y-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-muted/50 rounded-xl p-4 border-2 border-border hover:border-primary transition-all"
            >
              {/* Produto e Logo da Loja */}
              <div className="flex items-center gap-3 mb-4">
                {/* Logo da Loja */}
                <div className="relative w-20 h-12 flex-shrink-0 bg-white rounded-lg p-1.5 border border-gray-200">
                  <Image 
                    src={offer.storeLogoUrl} 
                    alt={offer.store} 
                    fill 
                    className="object-contain p-1" 
                  />
                </div>
                
                {/* Nome do Produto */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
                    {productName}
                  </p>
                  <p className="text-xs text-primary font-semibold mt-0.5">{offer.store}</p>
                </div>
              </div>
              
              {/* Preço e Botão */}
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    R$ {offer.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">à vista</p>
                </div>
                <Button asChild size="sm" className="bg-green-500 hover:bg-green-600 whitespace-nowrap">
                  <Link href={offer.offerUrl} target="_blank" rel="noopener noreferrer">
                    Ver Oferta
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer informativo */}
        <div className="border-t px-6 py-4 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            💡 Os preços podem variar. Clique em "Ver Oferta" para confirmar o valor atualizado.
          </p>
        </div>
      </div>
    </>
  );
}