'use client';

import { useState, useMemo } from 'react';
import { Product, ProductType } from '@/shared/types';
import { ProductCard } from './ProductCard';
import { cn } from '@/shared/utils/cn';

interface ProductGridProps {
  products: Product[];
}

type Filter = ProductType | 'all';

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'salgado', label: 'Salgados' },
  { key: 'doce', label: 'Doces' },
  { key: 'misto', label: 'Mistos' },
  { key: 'pao_de_queijo', label: 'Pão de Queijo' },
];

export function ProductGrid({ products }: ProductGridProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? products : products.filter((p) => p.type === filter)),
    [products, filter],
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium border transition-all',
              filter === f.key
                ? 'bg-brand-terracotta border-brand-terracotta text-white'
                : 'border-brand-gold/30 text-brand-gold hover:border-brand-gold',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
