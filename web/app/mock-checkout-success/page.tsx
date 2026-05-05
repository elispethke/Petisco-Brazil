// /Users/elispethke/Desktop/PetiscoBrazilApp/web/app/mock-checkout-success/page.tsx
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type PageState = 'loading' | 'success' | 'error' | 'missing';

function MockCheckoutContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [state, setState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!orderId) {
      setState('missing');
      return;
    }

    async function markAsPaid() {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      if (error) {
        console.error('[mock-checkout] Supabase error:', error);
        setErrorMessage(error.message);
        setState('error');
      } else {
        setState('success');
      }
    }

    markAsPaid();
  }, [orderId]);

  // ── Loading ──
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#003322] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin mx-auto mb-5" />
          <p className="text-white/60 text-base">Confirmando pagamento...</p>
          <p className="text-white/30 text-sm mt-1">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // ── Missing order ID ──
  if (state === 'missing') {
    return (
      <div className="min-h-screen bg-[#003322] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-8">
            <p className="text-yellow-400 text-4xl mb-4">⚠️</p>
            <h1 className="text-white font-serif text-2xl font-bold mb-2">
              Pedido não encontrado
            </h1>
            <p className="text-white/50 text-sm mb-6">
              Nenhum <code className="text-[#C5A059]">order_id</code> foi fornecido na URL.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#C5A059] hover:bg-[#b8943e] text-[#003322] font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-[#003322] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-8 h-8 text-red-400"
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
            <h1 className="text-white font-serif text-2xl font-bold mb-2">
              Erro ao actualizar pedido
            </h1>
            <p className="text-white/50 text-sm mb-2">
              Não foi possível marcar o pedido como pago.
            </p>
            {errorMessage && (
              <p className="text-red-300/70 text-xs font-mono bg-red-500/10 rounded-lg px-3 py-2 mb-6">
                {errorMessage}
              </p>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors border border-white/10"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Success ──
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

        {/* Test mode badge */}
        <div className="inline-flex items-center gap-1.5 bg-yellow-500/15 border border-yellow-500/25 rounded-full px-3 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span className="text-yellow-300 text-xs font-bold tracking-widest uppercase">
            Modo Teste
          </span>
        </div>

        {/* Checkmark */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
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
        </div>

        {/* Message */}
        <h1 className="text-white font-serif text-4xl font-bold mb-3">
          Pedido confirmado!
        </h1>
        <p className="text-white/60 text-base leading-relaxed mb-2">
          O pedido foi marcado como <span className="text-green-400 font-semibold">pago</span> na base de dados.
        </p>
        <p className="text-yellow-300/60 text-sm mb-8">
          [MODO TESTE] — Nenhum pagamento real foi processado.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-[#004433] border border-white/8 rounded-2xl px-5 py-4 mb-8">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">
              ID do pedido
            </p>
            <p className="text-[#C5A059] font-mono text-sm font-bold tracking-wide break-all">
              {orderId}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#b8943e] text-[#003322] font-bold text-base px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-[#C5A059]/20"
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
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 text-white/70 hover:text-white font-semibold text-base px-6 py-4 rounded-2xl transition-colors border border-white/10"
          >
            Ver no Dashboard
          </Link>
        </div>

        <p className="text-white/20 text-xs mt-10">
          Petisco Brazil · Ambiente de testes · Não partilhar com clientes
        </p>
      </div>
    </div>
  );
}

export default function MockCheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#003322] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C5A059]/40 border-t-[#C5A059] rounded-full animate-spin" />
        </div>
      }
    >
      <MockCheckoutContent />
    </Suspense>
  );
}
