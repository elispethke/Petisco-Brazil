import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export function AuthLogo() {
  const { t } = useTranslation();

  return (
    <View className="items-center mb-8">
      <Text className="text-brand-gold text-[10px] tracking-[4px] uppercase font-sans-medium mb-2">
        {t('auth.tagline')}
      </Text>
      <Text className="text-white text-[52px] font-serif leading-[56px]">Petisco</Text>
      <Text className="text-brand-gold text-[52px] font-serif leading-[56px]">Brazil</Text>
      <View className="w-12 h-px bg-brand-gold/50 mt-4" />
    </View>
  );
}
