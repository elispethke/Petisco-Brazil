import React from 'react';
import { AuthLayout }      from '@/features/auth/components/AuthLayout';
import { RegisterFormCard } from '@/features/auth/screens/RegisterFormCard';

export default function RegisterScreen() {
  return (
    <AuthLayout>
      <RegisterFormCard />
    </AuthLayout>
  );
}
