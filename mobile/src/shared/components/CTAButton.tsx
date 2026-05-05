import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  type PressableProps,
} from 'react-native';
import { Color, Font, FontSize, Radius, Shadow, Space } from '@/shared/theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';

interface CTAButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  rightBadge?: string;
  fullWidth?: boolean;
}

export function CTAButton({
  label,
  variant = 'primary',
  loading = false,
  rightBadge,
  fullWidth = true,
  disabled,
  ...rest
}: CTAButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Color.white : Color.terracotta} />
      ) : (
        <View style={styles.inner}>
          <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
          {rightBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{rightBadge}</Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    paddingVertical: 17,
    paddingHorizontal: Space[5],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.55 },

  // Variants
  primary: {
    backgroundColor: Color.terracotta,
    ...Shadow.cta,
  },
  secondary: {
    backgroundColor: Color.white,
    borderWidth: 1.5,
    borderColor: Color.terracotta,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: Space[2],
  },

  // Labels
  inner: { flexDirection: 'row', alignItems: 'center', gap: Space[2] },
  label: { fontSize: FontSize.md, fontFamily: Font.sansBold, letterSpacing: 0.2 },
  primaryLabel: { color: Color.white },
  secondaryLabel: { color: Color.terracotta },
  ghostLabel: { color: Color.terracotta },

  // Right badge (price)
  badge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.sm,
    paddingHorizontal: Space[2],
    paddingVertical: 4,
  },
  badgeText: { color: Color.white, fontSize: FontSize.base, fontFamily: Font.sansBold },
});
