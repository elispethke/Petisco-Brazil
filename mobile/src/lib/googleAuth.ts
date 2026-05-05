import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from './firebase';

WebBrowser.maybeCompleteAuthSession();

// ─── Client IDs ───────────────────────────────────────────────────────────────
// Add these to mobile/.env to enable Google Sign-In:
// EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxx.apps.googleusercontent.com
// EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxx.apps.googleusercontent.com
// EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxx.apps.googleusercontent.com

const PLACEHOLDER = 'not-configured';

const GOOGLE_CONFIG = {
  webClientId:     process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID     ?? PLACEHOLDER,
  iosClientId:     process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID     ?? PLACEHOLDER,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? PLACEHOLDER,
};

export const isGoogleSignInConfigured =
  GOOGLE_CONFIG.webClientId !== PLACEHOLDER &&
  GOOGLE_CONFIG.iosClientId !== PLACEHOLDER;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGoogleSignIn(onSuccess: () => void, onError: (msg: string) => void) {
  // Always call the hook (Rules of Hooks) — placeholder values prevent the crash
  // when env vars are not set. promptAsync is gated by isGoogleSignInConfigured.
  const [request, response, promptAsync] = Google.useAuthRequest(GOOGLE_CONFIG);

  useEffect(() => {
    if (!isGoogleSignInConfigured) return;
    if (response?.type !== 'success') {
      if (response?.type === 'error') onError('Erro ao autenticar com Google.');
      return;
    }

    const idToken = response.params?.id_token;
    if (!idToken) { onError('Token do Google não encontrado.'); return; }

    const credential = GoogleAuthProvider.credential(idToken);
    signInWithCredential(auth, credential)
      .then(onSuccess)
      .catch(() => onError('Falha ao entrar com Google.'));
  }, [response]);

  // When not configured, promptAsync is never called — the hook consumer checks isGoogleSignInConfigured first.
  const safePromptAsync = isGoogleSignInConfigured ? promptAsync : () => Promise.resolve(null);

  return { promptAsync: safePromptAsync, ready: isGoogleSignInConfigured && !!request };
}
