import React from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { Color, Font, FontSize, Radius, Space } from '@/shared/theme/tokens';

interface AuthFieldProps extends TextInputProps {
  label: string;
}

export function AuthField({ label, ...inputProps }: AuthFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="rgba(0,51,34,0.3)"
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: Space[2] },
  label: {
    color: Color.green,
    fontSize: FontSize.xs,
    fontFamily: Font.sansBold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Color.offWhite,
    borderRadius: Radius.md,
    paddingHorizontal: Space[4],
    paddingVertical: 14,
    fontSize: FontSize.md,
    fontFamily: Font.sans,
    color: Color.green,
    borderWidth: 1.5,
    borderColor: 'rgba(0,51,34,0.08)',
  },
});
