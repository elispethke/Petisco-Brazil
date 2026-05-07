import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/shared/components/AppBackground';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/shared/store/authStore';
import { useTranslation } from 'react-i18next';

export default function PendingScreen() {
  const { t }        = useTranslation();
  const { signOut: clearAuth } = useAuthStore();

  const handleSignOut = async () => {
    await signOut(auth);
    clearAuth();
  };

  return (
    <AppBackground>
    <SafeAreaView className="flex-1 bg-transparent items-center justify-center px-8">
      <Text className="text-brand-gold text-[48px] mb-6">⏳</Text>

      <Text className="text-white text-2xl font-serif text-center mb-3">
        {t('auth.pending.title', { defaultValue: 'Conta em análise' })}
      </Text>

      <Text className="text-white/60 text-[15px] font-sans text-center leading-6 mb-10">
        {t('auth.pending.body', {
          defaultValue:
            'Seu cadastro como entregador está sendo verificado pela nossa equipe. Você receberá acesso assim que for aprovado.',
        })}
      </Text>

      <Pressable
        className="border border-brand-gold/40 rounded-2xl px-8 py-[14px] active:opacity-70"
        onPress={handleSignOut}
      >
        <Text className="text-brand-gold text-[15px] font-sans-medium">
          {t('profile.logout', { defaultValue: 'Sair' })}
        </Text>
      </Pressable>
    </SafeAreaView>
    </AppBackground>
  );
}
