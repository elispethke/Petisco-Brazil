import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
  type PressableProps,
} from 'react-native';
import { Color } from '@/shared/theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';

interface CTAButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  rightBadge?: string;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-brand-terracotta shadow-lg',
  secondary: 'bg-white border-[1.5px] border-brand-terracotta',
  ghost:     'bg-transparent py-2',
};

const labelClasses: Record<Variant, string> = {
  primary:   'text-white',
  secondary: 'text-brand-terracotta',
  ghost:     'text-brand-terracotta',
};

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
      className={[
        'rounded-2xl py-[17px] px-5 items-center justify-center min-h-[54px]',
        variantClasses[variant],
        fullWidth ? 'self-stretch' : '',
        isDisabled ? 'opacity-[0.55]' : 'active:opacity-80',
      ].join(' ')}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Color.white : Color.terracotta} />
      ) : (
        <View className="flex-row items-center gap-2">
          <Text className={`text-base font-sans-bold tracking-[0.2px] ${labelClasses[variant]}`}>
            {label}
          </Text>
          {rightBadge && (
            <View className="bg-white/[.18] rounded-lg px-2 py-1">
              <Text className="text-white text-sm font-sans-bold">{rightBadge}</Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}
