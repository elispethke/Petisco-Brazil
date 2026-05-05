import React, { useState, useRef, useEffect } from 'react';
import { Animated, View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { AuthLogo }     from '../components/AuthLogo';
import { AuthCard }     from '../components/AuthCard';
import { AuthField }    from '../components/AuthField';
import { AuthFeedback } from '../components/AuthFeedback';

export function RegisterFormCard() {
  const { t } = useTranslation();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  const { handleRegister, loading, error, errorSeq } = useRegister();

  const shakeX = useRef(new Animated.Value(0)).current;

  const shake = () =>
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();

  useEffect(() => {
    if (errorSeq > 0) shake();
  }, [errorSeq]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeX }] }} className="w-full">
      <AuthLogo />

      <AuthCard title={t('auth.register.title')}>

        <AuthField
          label={t('auth.register.name')}
          icon="user"
          value={name}
          onChangeText={setName}
          placeholder={t('auth.register.name_placeholder')}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <AuthField
          label={t('auth.register.email')}
          icon="mail"
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.register.email_placeholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <AuthField
          label={t('auth.register.phone')}
          icon="phone"
          value={phone}
          onChangeText={setPhone}
          placeholder={t('auth.register.phone_placeholder')}
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <AuthField
          label={t('auth.register.password')}
          icon="lock"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <AuthField
          label={t('auth.register.confirm_password')}
          icon="check-circle"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="••••••••"
          secureTextEntry
        />

        <AuthFeedback error={error} />

        <Pressable
          onPress={() => handleRegister({ name, email, phone, password, confirm })}
          disabled={loading}
          className={`mt-1 flex-row items-center justify-center gap-2 rounded-xl bg-brand-terracotta py-[17px] shadow-lg ${loading ? 'opacity-[0.55]' : 'active:opacity-80'}`}
        >
          <Text className="text-white text-base font-sans-bold tracking-[0.3px]">
            {loading ? t('auth.register.button_loading') : t('auth.register.button')}
          </Text>
          {!loading && <Feather name="arrow-right" size={18} color="#FFFFFF" />}
        </Pressable>

        <View className="h-px bg-white/[.06]" />

        <Pressable className="flex-row justify-center gap-1.5" onPress={() => router.back()}>
          <Text className="text-white/[.45] text-sm font-sans">
            {t('auth.register.already_have_account')}
          </Text>
          <Text className="text-brand-gold text-sm font-sans-bold">
            {t('auth.register.login_link')}
          </Text>
        </Pressable>

      </AuthCard>
    </Animated.View>
  );
}
