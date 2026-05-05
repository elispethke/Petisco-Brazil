import React from 'react';
import { View, Text } from 'react-native';

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <View className="w-full rounded-[28px] border border-brand-gold/20 bg-brand-green/50 p-7 shadow-2xl">
      <Text className="md-1 text-[22px] text-white font-serif">
        {title}
      </Text>
      <View className="gap-3">
      {children}
      </View>
    </View>
  );
}

