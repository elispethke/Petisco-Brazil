import Link from 'next/link';
import { ArrowRight, ShoppingBag, Clock, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-green">
      {/* Nav */}
      <nav className="border-b border-brand-gold/20 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase font-medium">
            Berlim
          </p>
          <h1 className="font-serif text-2xl font-bold text-white leading-tight">
            Petisco Brazil
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/catalog"
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            Cardápio
          </Link>
          <Link
            href="/admin"
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            Admin
          </Link>
          <Link
            href="/catalog"
            className="bg-brand-terracotta text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Encomendar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-2xl">
          <p className="text-brand-gold text-sm tracking-[0.4em] uppercase mb-4">
            Delivery próprio • Berlim
          </p>
          <h2 className="font-serif text-6xl font-bold text-white leading-tight mb-6">
            Sabores autênticos{' '}
            <span className="text-brand-gold">do Brasil</span>
            <br />
            na sua porta
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Combos artesanais de salgados, doces e pão de queijo.
            Encomende até quarta-feira. Entregas de quarta a domingo.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-brand-terracotta text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Ver Cardápio
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShoppingBag,
              title: 'Combos Exclusivos',
              desc: 'Mínimo 20 unidades de salgados, doces, mistos ou pão de queijo.',
            },
            {
              icon: Clock,
              title: 'Encomende até Quarta',
              desc: 'Pedidos aceitos de segunda a quarta. Entregas de quarta a domingo.',
            },
            {
              icon: Star,
              title: 'Artesanal & Autêntico',
              desc: 'Receitas tradicionais brasileiras feitas com ingredientes premium.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-brand-green-light rounded-2xl p-6 border border-brand-gold/15 shadow-gourmet"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4">
                <item.icon size={20} className="text-brand-gold" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
