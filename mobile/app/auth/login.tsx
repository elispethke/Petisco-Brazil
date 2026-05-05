import React from 'react';
import { AuthLayout }     from '@/features/auth/components/AuthLayout';
import { LoginFormCard }  from '@/features/auth/screens/LoginFormCard';


export default function LoginScreen() {
  return (
    <AuthLayout>
      <LoginFormCard />
    </AuthLayout>
  );
}
