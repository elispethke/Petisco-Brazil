'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Smartphone, X, Leaf, ShoppingBag } from 'lucide-react';

// ─── DATA ──────────────────────────────────────────────────────────────────────

const SALGADOS = [
  'Coxinha',
  'Sirole de Carne',
  'Sirole de Camarão',
  'Enroladinho de Queijo e Presunto',
  'Empadinha de Camarão',
  'Empadinha de Frango',
  'Bolinho de Bacalhau',
  'Bolinho de Aipim',
];

const BOLOS = [
  'Cenoura com Chocolate',
  'Brigadeiro',
  'Ninho',
  'Milho',
  'Floresta Negra',
  'Red Velvet',
  'Prestígio',
  'Maracujá Trufado',
  'Limão Siciliano',
  'Pistache',
  'Coco Queimado',
  'Doce de Leite',
];

const DOCES_COMBOS = [
  { name: 'Brigadeiro', desc: 'Tradicional, cremoso, granulado belga.', type: 'DOCE' },
  { name: 'Beijinho', desc: 'Coco fresco e leite condensado.', type: 'DOCE' },
  { name: 'Brigadeiro de Ninho', desc: 'Leite Ninho importado, finalizado com pó.', type: 'DOCE' },
  { name: 'Combo Festa 50', desc: '50 doceiros surtidos premium.', type: 'COMBO' },
  { name: 'Combo Executivo', desc: '20 salgados + 10 doces.', type: 'COMBO' },
  { name: 'Combo Família', desc: 'Salgados, doces e bolo no kit.', type: 'COMBO' },
];

const CIDADES = [
  { name: 'Rio de Janeiro', img: '/images/rio.jpg' },
  { name: 'Lençóis Maranhenses', img: '/images/lencois.jpg' },
  { name: 'Salvador', img: '/images/salvador.jpg' },
];

// ─── ANIMATIONS ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
} as const;

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
} as const;

// ─── MODALS ────────────────────────────────────────────────────────────────────

function OrderModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-3xl p-8 max-w-sm w-full shadow-card"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-serif text-2xl font-bold text-white">Peça no App</h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Baixe o aplicativo Petisco Brasil, monte seu combo e receba em casa. Quarta a domingo.
        </p>
        <div className="space-y-3">
          <a
            href="#"
            className="btn-gold w-full justify-center py-3.5 px-6"
          >
            <Smartphone size={16} />
            App Store — iOS
          </a>
          <a
            href="#"
            className="btn-ghost-gold w-full justify-center py-3.5 px-6"
          >
            <Smartphone size={16} />
            Google Play — Android
          </a>
        </div>
        <p className="text-white/25 text-xs text-center mt-5">Em breve disponível</p>
      </motion.div>
    </motion.div>
  );
}

function PrivacyBanner({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4"
    >
      <div className="glass-strong rounded-2xl px-6 py-4 flex items-center gap-4 shadow-card">
        <p className="text-white/60 text-xs leading-relaxed flex-1">
          Este site é informativo. Não coletamos dados pessoais. Pedidos exclusivamente pelo app.
        </p>
        <button
          onClick={onClose}
          className="btn-gold text-xs py-2 px-4 whitespace-nowrap"
        >
          Entendido
        </button>
      </div>
    </motion.div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [orderModal, setOrderModal] = useState(false);
  const [privacyBanner, setPrivacyBanner] = useState(true);

  return (
    <>
      {/* Modals */}
      <AnimatePresence>
        {orderModal && <OrderModal onClose={() => setOrderModal(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {privacyBanner && <PrivacyBanner onClose={() => setPrivacyBanner(false)} />}
      </AnimatePresence>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-bold text-white">
            Petisco Brasil
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Salgados', 'Bolos', 'Doces', 'Brasil'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <button
            onClick={() => setOrderModal(true)}
            className="btn-gold text-sm py-2.5 px-5"
          >
            Peça no App
          </button>
        </nav>
      </header>

      <main>
        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <section className="min-h-screen flex items-center pt-16">
          <div className="max-w-7xl mx-auto px-6 w-full py-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
              className="max-w-2xl"
            >
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 border border-white/20 text-white/60 text-[11px] font-semibold tracking-[0.25em] uppercase px-4 py-2 rounded-full mb-8"
              >
                <Leaf size={11} className="text-brand-gold" />
                Delivery próprio · Sabor de casa
              </motion.span>

              <motion.h1
                variants={fadeUp}
                className="font-serif font-bold leading-none mb-6"
              >
                <span className="text-white block text-7xl md:text-8xl">Petisco</span>
                <span className="text-brand-gold italic block text-7xl md:text-8xl">Brasil</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-white/55 text-lg leading-relaxed mb-10 max-w-xl"
              >
                Salgados, bolos e doces artesanais do Brasil — preparados com receitas de família e ingredientes premium. Direto na sua porta.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex items-center gap-4 flex-wrap"
              >
                <button
                  onClick={() => setOrderModal(true)}
                  className="btn-gold text-sm py-3.5 px-7"
                >
                  Peça no App <ArrowRight size={16} />
                </button>
                <a href="#salgados" className="btn-ghost-gold text-sm py-3.5 px-7">
                  Ver cardápio
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── SALGADOS ───────────────────────────────────────────────────────── */}
        <section id="salgados" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className="relative h-[480px] rounded-3xl overflow-hidden shadow-card"
              >
                <Image
                  src="/images/salgados.jpg"
                  alt="Salgados artesanais Petisco Brasil"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <span className="section-label">Cardápio</span>
                <h2 className="font-serif text-5xl font-bold text-white mb-8 leading-tight">
                  Salgados{' '}
                  <em className="text-brand-gold not-italic italic">artesanais</em>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {SALGADOS.map((item) => (
                    <div
                      key={item}
                      className="glass border-l-2 border-brand-gold rounded-xl px-4 py-3 hover:bg-white/8 transition-colors"
                    >
                      <span className="text-white/85 text-sm font-medium leading-snug block">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── BOLOS ──────────────────────────────────────────────────────────── */}
        <section id="bolos" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
              >
                <span className="section-label">Confeitaria</span>
                <h2 className="font-serif text-5xl font-bold text-white mb-8 leading-tight">
                  Bolos{' '}
                  <em className="text-brand-gold not-italic italic">gourmet</em>
                </h2>
                <div className="grid grid-cols-3 gap-2.5">
                  {BOLOS.map((item) => (
                    <div
                      key={item}
                      className="glass border-l-2 border-brand-gold rounded-xl px-3 py-3 hover:bg-white/8 transition-colors"
                    >
                      <span className="text-white/85 text-xs font-medium leading-snug block">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className="relative h-[480px] rounded-3xl overflow-hidden shadow-card"
              >
                <Image
                  src="/images/bolo.jpg"
                  alt="Bolos gourmet Petisco Brasil"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── DOCES & COMBOS ─────────────────────────────────────────────────── */}
        <section id="doces" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.span variants={fadeUp} className="section-label">
                Brigaderia
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="font-serif text-5xl font-bold text-white mb-12 leading-tight"
              >
                Doces &{' '}
                <em className="text-brand-gold not-italic italic">Combos</em>
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {DOCES_COMBOS.map((item) => (
                  <motion.div
                    key={item.name}
                    variants={fadeUp}
                    className="glass rounded-2xl p-5 hover:bg-white/8 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-8 h-8 bg-brand-gold/15 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={14} className="text-brand-gold" />
                      </div>
                      <span className="text-brand-gold/70 text-[10px] font-bold tracking-widest uppercase">
                        {item.type}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-base mb-1.5">{item.name}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                variants={fadeIn}
                className="relative h-72 rounded-3xl overflow-hidden shadow-card"
              >
                <Image
                  src="/images/doces.jpg"
                  alt="Doces e brigadeiros Petisco Brasil"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062419]/60 via-transparent to-transparent" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── LIFESTYLE — O BRASIL ───────────────────────────────────────────── */}
        <section id="brasil" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            >
              <motion.span variants={fadeUp} className="section-label">
                Lifestyle
              </motion.span>
              <motion.h2
                variants={fadeUp}
                className="font-serif text-5xl font-bold text-white mb-12 leading-tight"
              >
                O{' '}
                <em className="text-brand-gold not-italic italic">Brasil</em>{' '}
                em cada mordida
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CIDADES.map((cidade, i) => (
                  <motion.div
                    key={cidade.name}
                    variants={fadeUp}
                    transition={{ delay: i * 0.08 }}
                    className="relative h-80 rounded-3xl overflow-hidden group shadow-card"
                  >
                    <Image
                      src={cidade.img}
                      alt={cidade.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <span className="text-white/50 text-[10px] font-bold tracking-[0.25em] uppercase">
                        Brasil
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {cidade.name}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="glass-strong rounded-3xl p-16 text-center shadow-card"
            >
              <span className="text-brand-gold text-2xl mb-6 block">✦</span>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">
                Sua próxima
              </h2>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-brand-gold italic mb-6 leading-tight">
                encomenda
              </h2>
              <p className="text-white/50 text-base mb-10 max-w-sm mx-auto leading-relaxed">
                Baixe o app, monte seu combo e receba em casa. Quarta a domingo.
              </p>
              <button
                onClick={() => setOrderModal(true)}
                className="btn-gold text-sm py-4 px-8 mx-auto"
              >
                Peça no App <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <span className="font-serif text-lg font-bold text-white">Petisco Brasil</span>

          <div className="flex items-center gap-6 text-white/40 text-sm flex-wrap">
            {['Salgados', 'Bolos', 'Doces', 'Brasil'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-white/70 transition-colors"
              >
                {item}
              </a>
            ))}
            <Link href="/admin" className="hover:text-white/70 transition-colors">
              Admin
            </Link>
          </div>

          <p className="text-white/30 text-xs">
            © 2026 — Sabor que atravessa o Atlântico
          </p>
        </div>
      </footer>
    </>
  );
}
