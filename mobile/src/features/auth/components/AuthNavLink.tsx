import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Color, Font, FontSize, Space } from '@/shared/theme/tokens';

interface AuthNavLinkProps {
  label: string;
  linkText: string;
  onPress: () => void;
}

export function AuthNavLink({ label, linkText, onPress }: AuthNavLinkProps) {
  return (
    <>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <View style={styles.dividerLine} />
      </View>
      <Pressable style={styles.row} onPress={onPress}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.link}>{linkText}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  dividerRow:  { flexDirection: 'row', gap: Space[2] },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,51,34,0.07)' },
  row:         { flexDirection: 'row', justifyContent: 'center' },
  label:       { color: 'rgba(0,51,34,0.5)', fontSize: FontSize.base, fontFamily: Font.sans },
  link:        { color: Color.terracotta, fontSize: FontSize.base, fontFamily: Font.sansBold },
});
