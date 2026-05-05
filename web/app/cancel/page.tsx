// /Users/elispethke/Desktop/PetiscoBrazilApp/web/app/cancel/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#003322] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Brand mark */}
        <div className="mb-8">
          <p className="text-[#C5A059] text-xs tracking-[4px] uppercase font-medium mb-2">
            Petisco Brazil
          </p>
          <div className="w-10 h-px bg-[#C5A059]/30 mx-auto" />
        </div>

        {/* X icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-white font-serif text-4xl font-bold mb-3">
          Pagamento cancelado
        </h1>
        <p className="text-white/60 text-base leading-relaxed mb-2">
          O pagamento não foi concluído. Não se preocupe — nenhum valor foi cobrado.
        </p>
        <p className="text-white/40 text-sm mb-10">
          Pode tentar novamente sempre que quiser.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 bg-[#B35C37] hover:bg-[#9a4e2f] text-white font-bold text-base px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-[#B35C37]/20"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Tentar novamente
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 text-white/70 hover:text-white font-semibold text-base px-8 py-4 rounded-2xl transition-colors border border-white/10"
          >
            Voltar ao início
          </Link>
        </div>

        {/* Help */}
        <div className="mt-10 bg-[#004433] border border-white/8 rounded-2xl px-5 py-4 text-left">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
            Precisa de ajuda?
          </p>
          <p className="text-white/50 text-sm">
            Se o problema persistir, entre em contacto pelo WhatsApp ou Instagram{' '}
            <span className="text-[#C5A059]">@petiscobrazil</span>.
          </p>
        </div>

        <p className="text-white/20 text-xs mt-8">
          Petisco Brazil · Berlim · Sabores do Brasil com amor
        </p>
      </div>
    </div>
  );
}
