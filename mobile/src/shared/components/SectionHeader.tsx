import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Color, Font, FontSize, Space } from '@/shared/theme/tokens';

interface SectionHeaderProps {
  title: string;
  linkLabel?: string;
  onLinkPress?: () => void;
}

export function SectionHeader({ title, linkLabel, onLinkPress }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {linkLabel && onLinkPress && (
        <Pressable onPress={onLinkPress} hitSlop={12}>
          <Text style={styles.link}>{linkLabel} →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space[5],
    marginBottom: Space[3],
  },
  title: {
    color: Color.white,
    fontSize: FontSize.lg,
    fontFamily: Font.serif,
  },
  link: {
    color: Color.gold,
    fontSize: FontSize.sm,
    fontFamily: Font.sansMedium,
  },
});
