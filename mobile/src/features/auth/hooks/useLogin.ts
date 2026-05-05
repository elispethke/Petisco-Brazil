import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateLoginForm, validateForgotPasswordForm } from '../validation/authValidation';
import { loginWithEmail, sendPasswordReset } from '../services/authService';

export function useLogin() {
  const { t } = useTranslation();

  const [loading, setLoading]           = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [errorSeq, setErrorSeq]         = useState(0);

  const fail = (key: string) => {
    setError(t(key));
    setErrorSeq(n => n + 1);
  };

  const handleLogin = async (email: string, password: string) => {
    const key = validateLoginForm(email, password);
    if (key) { fail(key); return; }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await loginWithEmail(email, password);
    } catch {
      fail('auth.login.error_invalid');
    } finally {
      setLoading(false);
    }
  };

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
    error,
    success,
    errorSeq,
    handleLogin,
    handleForgotPassword,
  };
}
