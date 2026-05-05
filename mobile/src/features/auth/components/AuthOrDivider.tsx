import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Font, FontSize, Space } from '@/shared/theme/tokens';

interface AuthOrDividerProps {
  label: string;
}

export function AuthOrDivider({ label }: AuthOrDividerProps) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.text}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: Space[2] },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(0,51,34,0.08)' },
  text: { color: 'rgba(0,51,34,0.4)', fontSize: FontSize.xs, fontFamily: Font.sans },
});
