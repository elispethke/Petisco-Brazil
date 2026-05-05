import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { MOCK_PRODUCTS } from '@/shared/mock/products';

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-brand-green">
      {/* Header */}
      <div className="border-b border-brand-gold/20 px-6 py-4 max-w-7xl mx-auto flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <div className="h-4 w-px bg-brand-gold/20" />
        <h1 className="font-serif text-2xl font-bold text-white">Cardápio</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-brand-gold text-sm tracking-[0.3em] uppercase mb-2">
            Encomendas
          </p>
          <h2 className="font-serif text-4xl font-bold text-white mb-3">
            Nossos Combos
          </h2>
          <p className="text-white/60 max-w-lg">
            Todos os combos são artesanais e feitos sob encomenda.
            Pedidos aceitos até quarta-feira para entrega de quarta a domingo.
          </p>
        </div>

        <ProductGrid products={MOCK_PRODUCTS} />
      </div>
    </div>
  );
}
