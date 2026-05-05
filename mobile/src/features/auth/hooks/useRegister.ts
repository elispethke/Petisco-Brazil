import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateRegisterForm, RegisterFormData } from '../validation/authValidation';
import { registerWithEmail } from '../services/authService';

export function useRegister() {
  const { t } = useTranslation();

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [errorSeq, setErrorSeq] = useState(0);

  const fail = (key: string) => {
    setError(t(key));
    setErrorSeq(n => n + 1);
  };

  const handleRegister = async (data: RegisterFormData) => {
    const key = validateRegisterForm(data);
    if (key) { fail(key); return; }

    setLoading(true);
    setError('');
    try {
      await registerWithEmail({
        name:     data.name,
        email:    data.email,
        phone:    data.phone,
        password: data.password,
      });
      // _layout.tsx onAuthStateChanged handles routing
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      fail(code === 'auth/email-already-in-use'
        ? 'auth.register.error_email_in_use'
        : 'auth.register.error_generic',
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error, errorSeq };
}
