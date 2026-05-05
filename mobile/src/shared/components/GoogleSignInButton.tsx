import React from 'react';
import { Pressable, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Color, Font, FontSize, Radius, Shadow, Space } from '@/shared/theme/tokens';

interface GoogleSignInButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function GoogleSignInButton({ label, onPress, loading = false, disabled = false }: GoogleSignInButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [
        styles.btn,
        pressed && !disabled && styles.btnPressed,
        disabled && styles.btnDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Color.neutral600} />
      ) : (
        <View style={styles.inner}>
          <View style={[styles.googleIcon, disabled && styles.googleIconDisabled]}>
            <Text style={styles.googleG}>G</Text>
          </View>
          <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Color.white,
    borderRadius: Radius.lg,
    paddingVertical: 15,
    paddingHorizontal: Space[5],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Color.neutral300,
    ...Shadow.subtle,
  },
  btnPressed:         { opacity: 0.85 },
  btnDisabled:        { opacity: 0.45 },
  inner:              { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  googleIcon: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconDisabled: { backgroundColor: Color.neutral300 },
  googleG: {
    color: Color.white,
    fontSize: FontSize.sm,
    fontFamily: Font.sansBold,
  },
  label:         { color: Color.neutral900, fontSize: FontSize.md, fontFamily: Font.sansBold },
  labelDisabled: { color: Color.neutral600 },
});
