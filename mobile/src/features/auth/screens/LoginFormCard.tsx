import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useLogin } from '@/features/auth/hooks/useLogin';
import { AuthLogo }     from '../components/AuthLogo';
import { AuthCard }     from '../components/AuthCard';
import { AuthField }    from '../components/AuthField';
import { AuthFeedback } from '../components/AuthFeedback';

export function LoginFormCard() {
  const { t } = useTranslation();

  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');

  const {
    loading,
    resetLoading,
    error,
    success,
    errorSeq,
    handleLogin,
    handleForgotPassword,
  } = useLogin();

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

      <AuthCard title={t('auth.login.title')}>

        <AuthField
          label={t('auth.login.email')}
          icon="user"
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.login.email_placeholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <AuthField
          label={t('auth.login.password')}
          icon="lock"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <AuthFeedback error={error} success={success} />

        <Pressable
          onPress={() => handleLogin(email, password)}
          disabled={loading}
          className={`mt-2 flex-row items-center justify-center gap-2 rounded-xl bg-brand-terracotta py-4 ${loading ? 'opacity-50' : 'active:opacity-80'}`}
        >
          <Text className="text-white font-sans-bold text-base">
            {loading ? t('auth.login.button_loading') : t('auth.login.button')}
          </Text>
          {!loading && <Feather name="arrow-right" size={18} color="#FFFFFF" />}
        </Pressable>

        <Pressable
          onPress={() => handleForgotPassword(email)}
          disabled={resetLoading}
          className="items-center py-1"
        >
          <Text className="text-brand-gold/80 text-sm font-sans-medium">
            {resetLoading ? t('auth.login.forgot_sending') : t('auth.login.forgot_password')}
          </Text>
        </Pressable>

        <View className="h-px bg-white/10 mt-2" />

        <Pressable
          onPress={() => router.push('/auth/register')}
          className="flex-row justify-center"
        >
          <Text className="text-white/50 text-sm font-sans">
            {t('auth.login.no_account')}
          </Text>
          <Text className="text-brand-gold font-sans-bold text-sm ml-1">
            {t('auth.login.register_link')}
          </Text>
        </Pressable>

      </AuthCard>
    </Animated.View>
  );
}
