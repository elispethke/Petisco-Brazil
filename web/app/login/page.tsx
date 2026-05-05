'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signIn } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'elispethke@gmail.com';

async function resolveRoleAndRedirect(email: string | null, push: (path: string) => void) {
  if (!email) { push('/login'); return; }
  if (email === ADMIN_EMAIL) { push('/admin'); return; }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', email)
    .single();

  const role = profile?.role ?? 'customer';
  if (role === 'admin' || role === 'production') push('/admin');
  else push('/login');
}

// ─── Google Button ────────────────────────────────────────────────────────────

function GoogleButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 bg-white border-[1.5px] border-[#D1D5DB] rounded-2xl py-3.5 text-[#111827] font-semibold text-sm hover:bg-[#F9FAFB] disabled:opacity-60 transition-colors shadow-sm"
    >
      <span className="w-5 h-5 rounded-full bg-[#4285F4] flex items-center justify-center text-white text-xs font-bold">
        G
      </span>
      {loading ? 'Conectando...' : 'Continuar com Google'}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ── Google ────────────────────────────────────────────────────────────────

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await resolveRoleAndRedirect(result.user.email, router.push);
    } catch {
      setError('Erro ao entrar com Google. Tente novamente.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Email ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Preencha todos os campos.'); return; }
    setError('');
    setLoading(true);
    try {
      const result = await signIn(email.trim(), password);
      await resolveRoleAndRedirect(result.user.email, router.push);
    } catch {
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#003322] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-[#C5A059] text-[10px] tracking-[4px] uppercase font-semibold mb-3">
            Sistema Interno
          </p>
          <h1 className="text-white font-serif text-5xl font-bold leading-tight">Petisco</h1>
          <h1 className="text-[#C5A059] font-serif text-5xl font-bold leading-tight">Brazil</h1>
          <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/30 flex flex-col gap-4">
          <h2 className="text-[#003322] font-serif text-2xl font-bold">
            Acesso ao Dashboard
          </h2>

          {/* Google */}
          <GoogleButton onClick={handleGoogleSignIn} loading={googleLoading} />

          {/* OR */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#003322]/08" />
            <span className="text-[#003322]/40 text-xs font-medium">ou entre com e-mail</span>
            <div className="flex-1 h-px bg-[#003322]/08" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#003322] text-[10px] font-bold uppercase tracking-[0.6px]">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[#F8F6F1] rounded-xl px-4 py-3.5 text-[#003322] text-sm placeholder-[#003322]/30 border-[1.5px] border-[#003322]/08 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#003322] text-[10px] font-bold uppercase tracking-[0.6px]">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8F6F1] rounded-xl px-4 py-3.5 text-[#003322] text-sm placeholder-[#003322]/30 border-[1.5px] border-[#003322]/08 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40 transition"
              />
            </div>

            {error && (
              <div className="bg-[#B35C37]/08 border border-[#B35C37]/20 rounded-xl px-4 py-3">
                <p className="text-[#B35C37] text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#B35C37] hover:bg-[#9a4e2f] disabled:opacity-60 text-white font-bold text-base rounded-2xl py-4 transition-colors shadow-lg shadow-[#B35C37]/30 mt-1"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-8">
          Acesso restrito · Petisco Brazil © 2025
        </p>
      </div>
    </div>
  );
}
