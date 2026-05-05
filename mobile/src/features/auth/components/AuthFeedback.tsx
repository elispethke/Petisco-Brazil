import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color, Font, FontSize, Radius, Space } from '@/shared/theme/tokens';

interface AuthFeedbackProps {
  error?: string;
  success?: string;
}

export function AuthFeedback({ error, success }: AuthFeedbackProps) {
  return (
    <>
      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {!!success && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{success}</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    backgroundColor: Color.errorBg,
    borderRadius: Radius.md,
    paddingHorizontal: Space[4],
    paddingVertical: Space[3],
    borderWidth: 1,
    borderColor: Color.errorBorder,
  },
  errorText: { color: Color.error, fontSize: FontSize.sm, fontFamily: Font.sansMedium },
  successBox: {
    backgroundColor: Color.successBg,
    borderRadius: Radius.md,
    paddingHorizontal: Space[4],
    paddingVertical: Space[3],
    borderWidth: 1,
    borderColor: Color.successBorder,
  },
  successText: { color: Color.success, fontSize: FontSize.sm, fontFamily: Font.sansMedium },
});
