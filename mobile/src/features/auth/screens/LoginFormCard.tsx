import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { AuthLogo }     from '../components/AuthLogo';
import { AuthFeedback } from '../components/AuthFeedback';
//import { GoogleButton } from '../components/GoogleButton';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';

// ── Icon-enhanced dark field ──────────────────────────────────────────────────

type FeatherName = React.ComponentProps<typeof Feather>['name'];

interface DarkFieldProps extends TextInputProps {
  label: string;
  icon: FeatherName;
}

function DarkField({ label, icon, ...inputProps }: DarkFieldProps) {
  return (
    <View style={field.wrap}>
      <Text style={field.label}>{label}</Text>
      <View style={field.row}>
        <Feather name={icon} size={16} color="rgba(197,160,89,0.7)" style={field.icon} />
        <TextInput
          style={field.input}
          placeholderTextColor="rgba(255,255,255,0.3)"
          {...inputProps}
        />
      </View>
    </View>
  );
}

const field = StyleSheet.create({
  wrap:  { gap: 6 },
  label: {
    color: 'rgba(197,160,89,0.85)',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.2)',
    paddingHorizontal: 16,
  },
  icon:  { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#FFFFFF',
  },
});

// ── Official Google button ────────────────────────────────────────────────────

interface GoogleBtnProps {
  label: string;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}

function GoogleBtn({ label, onPress, loading, disabled }: GoogleBtnProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [
        gBtn.btn,
        pressed && gBtn.pressed,
        disabled && gBtn.disabled,
      ]}
    >
      {/* Official Google G — four-color segments */}
      <View style={gBtn.gCircle}>
        <View style={gBtn.gTopLeft}   />
        <View style={gBtn.gTopRight}  />
        <View style={gBtn.gBotRight}  />
        <View style={gBtn.gBotLeft}   />
        <View style={gBtn.gCenter}>
          <Text style={gBtn.gLetter}>G</Text>
        </View>
      </View>
      <Text style={gBtn.label}>{label}</Text>
    </Pressable>
  );
}

const G = 22;
const gBtn = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#DADCE0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed:  { opacity: 0.85 },
  disabled: { opacity: 0.45 },

  gCircle: {
    width: G,
    height: G,
    borderRadius: G / 2,
    overflow: 'hidden',
    position: 'relative',
  },
  gTopLeft:  { position: 'absolute', top: 0,    left: 0,    width: G / 2, height: G / 2, backgroundColor: '#4285F4' },
  gTopRight: { position: 'absolute', top: 0,    right: 0,   width: G / 2, height: G / 2, backgroundColor: '#EA4335' },
  gBotRight: { position: 'absolute', bottom: 0, right: 0,   width: G / 2, height: G / 2, backgroundColor: '#34A853' },
  gBotLeft:  { position: 'absolute', bottom: 0, left: 0,    width: G / 2, height: G / 2, backgroundColor: '#FBBC05' },
  gCenter: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: G / 2 - 4,
    margin: 4,
  },
  gLetter: { color: '#4285F4', fontSize: 11, fontFamily: 'Inter_700Bold', lineHeight: 14 },
  label:   { color: '#3C4043', fontSize: 15, fontFamily: 'Inter_700Bold' },
});

// ── OR divider ────────────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <View style={div.row}>
      <View style={div.line} />
      <Text style={div.text}>{label}</Text>
      <View style={div.line} />
    </View>
  );
}

const div = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  text: { color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'Inter_400Regular' },
});

// ── Main form card ────────────────────────────────────────────────────────────

export function LoginFormCard() {
  const { t } = useTranslation();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const {
    loading,
    resetLoading,
    googleLoading,
    error,
    success,
    errorSeq,
    isGoogleAvailable,
    handleLogin,
    handleGoogleSignIn,
    handleForgotPassword,
  } = useLogin();

  // ── Shake on error ────────────────────────────────────────────────────────

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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ translateX: shakeX }] }]}>
      <AuthLogo />

      {/* Glass card */}
      <View style={styles.card}>
        <Text style={styles.title}>{t('auth.login.title')}</Text>

        <DarkField
          label={t('auth.login.email')}
          icon="user"
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.login.email_placeholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <DarkField
          label={t('auth.login.password')}
          icon="lock"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <AuthFeedback error={error} success={success} />

        {/* Primary CTA */}
        <Pressable
          onPress={() => handleLogin(email, password)}
          disabled={loading || googleLoading}
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && styles.submitPressed,
            (loading || googleLoading) && styles.submitDisabled,
          ]}
        >
          <Text style={styles.submitText}>
            {loading ? t('auth.login.button_loading') : t('auth.login.button')}
          </Text>
          {!loading && <Feather name="arrow-right" size={18} color="#FFFFFF" />}
        </Pressable>

        {/* Forgot password */}
        <Pressable
          onPress={() => handleForgotPassword(email)}
          disabled={resetLoading}
          style={styles.forgotBtn}
        >
          <Text style={styles.forgotText}>
            {resetLoading ? t('auth.login.forgot_sending') : t('auth.login.forgot_password')}
          </Text>
        </Pressable>

        {/* Divider → Google */}
        <Divider label={t('auth.login.or_divider')} />

        <GoogleBtn
          label={t('auth.login.google')}
          onPress={handleGoogleSignIn}
          loading={googleLoading}
          disabled={!isGoogleAvailable}
        />

        {/* Register link */}
        <View style={styles.dividerLine} />
        <Pressable style={styles.navRow} onPress={() => router.push('/auth/register')}>
          <Text style={styles.navText}>{t('auth.login.no_account')}</Text>
          <Text style={styles.navLink}>{t('auth.login.register_link')}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%' },

  card: {
    backgroundColor: 'rgba(0,30,20,0.72)',
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.18)',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.45,
    shadowRadius: 48,
    elevation: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 4,
  },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#B35C37',
    borderRadius: 14,
    paddingVertical: 17,
    marginTop: 4,
    shadowColor: '#B35C37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  submitPressed:  { opacity: 0.85 },
  submitDisabled: { opacity: 0.55 },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.3,
  },

  forgotBtn:  { alignItems: 'center', paddingVertical: 4 },
  forgotText: { color: 'rgba(197,160,89,0.8)', fontSize: 13, fontFamily: 'Inter_500Medium' },

  dividerLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  navRow:      { flexDirection: 'row', justifyContent: 'center' },
  navText:     { color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: 'Inter_400Regular' },
  navLink:     { color: '#C5A059', fontSize: 14, fontFamily: 'Inter_700Bold' },
});
