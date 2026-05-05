import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface SectionHeaderProps {
  title: string;
  linkLabel?: string;
  onLinkPress?: () => void;
}

export function SectionHeader({ title, linkLabel, onLinkPress }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 mb-3">
      <Text className="text-white text-lg font-serif">{title}</Text>
      {linkLabel && onLinkPress && (
        <Pressable onPress={onLinkPress} hitSlop={12}>
          <Text className="text-brand-gold text-xs font-sans-medium">{linkLabel} →</Text>
        </Pressable>
      )}
    </View>
  );
}
