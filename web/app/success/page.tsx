// /Users/elispethke/Desktop/PetiscoBrazilApp/web/app/success/page.tsx
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') ?? searchParams.get('session_id');

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

        {/* Checkmark */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-white font-serif text-4xl font-bold mb-3">
          Pedido confirmado!
        </h1>
        <p className="text-white/60 text-base leading-relaxed mb-2">
          Recebemos o seu pedido e já estamos a preparar tudo com muito carinho.
        </p>
        <p className="text-white/40 text-sm mb-8">
          Em breve entraremos em contacto para combinar a entrega.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-[#004433] border border-white/8 rounded-2xl px-5 py-4 mb-8 inline-block mx-auto">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">
              Referência do pedido
            </p>
            <p className="text-[#C5A059] font-mono text-sm font-bold tracking-wide">
              {orderId.length > 20 ? `#${orderId.slice(0, 16).toUpperCase()}...` : `#${orderId.toUpperCase()}`}
            </p>
          </div>
        )}

        {/* CTA */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#b8943e] text-[#003322] font-bold text-base px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-[#C5A059]/20 w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar ao início
          </Link>
        </div>

        <p className="text-white/20 text-xs mt-10">
          Petisco Brazil · Berlim · Sabores do Brasil com amor
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#003322] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C5A059]/40 border-t-[#C5A059] rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
