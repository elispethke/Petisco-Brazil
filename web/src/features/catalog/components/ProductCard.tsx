'use client';

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/shared/types';

interface ProductCardProps {
  product: Product;
}

const TYPE_LABELS: Record<string, string> = {
  salgado: 'Salgados',
  doce: 'Doces',
  misto: 'Misto',
  pao_de_queijo: 'Pão de Queijo',
};

export function ProductCard({ product }: ProductCardProps) {
  const price = (product.price / 100).toFixed(2);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-brand-gold/20 shadow-gourmet hover:shadow-gourmet-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-brand-green/90 text-brand-gold text-xs font-semibold px-3 py-1 rounded-full border border-brand-gold/30">
            {TYPE_LABELS[product.type]}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-brand-green text-base leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-brand-terracotta font-bold text-xl">€{price}</p>
            <p className="text-gray-400 text-xs">
              mín. {product.quantity} unidades
            </p>
          </div>
          <button className="flex items-center gap-2 bg-brand-terracotta text-white px-4 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
            <ShoppingCart size={16} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
