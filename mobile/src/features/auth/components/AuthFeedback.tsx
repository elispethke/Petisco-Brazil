import React from 'react';
import { View, Text } from 'react-native';

interface AuthFeedbackProps {
  error?: string;
  success?: string;
}

export function AuthFeedback({ error, success }: AuthFeedbackProps) {
  return (
    <>
      {!!error && (
        <View className="rounded-xl bg-brand-terracotta/[.08] border border-brand-terracotta/20 px-4 py-3">
          <Text className="text-brand-terracotta text-xs font-sans-medium">{error}</Text>
        </View>
      )}
      {!!success && (
        <View className="rounded-xl bg-green-800/[.08] border border-green-800/20 px-4 py-3">
          <Text className="text-green-800 text-xs font-sans-medium">{success}</Text>
        </View>
      )}
    </>
  );
}
