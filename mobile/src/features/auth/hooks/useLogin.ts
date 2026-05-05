import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGoogleSignIn, isGoogleSignInConfigured } from '@/lib/googleAuth';
import { validateLoginForm, validateForgotPasswordForm } from '../validation/authValidation';
import { loginWithEmail, sendPasswordReset } from '../services/authService';

export function useLogin() {
  const { t } = useTranslation();

  const [loading, setLoading]             = useState(false);
  const [resetLoading, setResetLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState('');
  const [errorSeq, setErrorSeq]           = useState(0); // increments on every error → triggers shake

  const fail = (key: string) => {
    setError(t(key));
    setErrorSeq(n => n + 1);
  };

  // ── Google ──────────────────────────────────────────────────────────────────

  const { promptAsync } = useGoogleSignIn(
    () => setGoogleLoading(false),
    () => { setGoogleLoading(false); fail('auth.login.error_invalid'); },
  );

  const handleGoogleSignIn = () => {
    if (!isGoogleSignInConfigured) {
      fail('auth.login.error_google_not_configured');
      return;
    }
    setError('');
    setSuccess('');
    setGoogleLoading(true);
    promptAsync();
  };

  // ── Email login ──────────────────────────────────────────────────────────────

  const handleLogin = async (email: string, password: string) => {
    const key = validateLoginForm(email, password);
    if (key) { fail(key); return; }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await loginWithEmail(email, password);
      // _layout.tsx onAuthStateChanged handles routing
    } catch {
      fail('auth.login.error_invalid');
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password ──────────────────────────────────────────────────────────

  const handleForgotPassword = async (email: string) => {
    const key = validateForgotPasswordForm(email);
    if (key) { fail(key); return; }

    setResetLoading(true);
    setError('');
    setSuccess('');
    try {
      await sendPasswordReset(email);
      setSuccess(t('auth.login.forgot_success'));
    } catch {
      fail('auth.login.error_forgot_failed');
    } finally {
      setResetLoading(false);
    }
  };

  return {
    loading,
    resetLoading,
    googleLoading,
    error,
    success,
    errorSeq,
    isGoogleAvailable: isGoogleSignInConfigured,
    handleLogin,
    handleGoogleSignIn,
    handleForgotPassword,
  };
}
