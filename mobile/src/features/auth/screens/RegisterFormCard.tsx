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
import { useRegister } from '@/features/auth/hooks/useRegister';
import { AuthLogo }     from '../components/AuthLogo';
import { AuthFeedback } from '../components/AuthFeedback';

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

// ── Main register card ────────────────────────────────────────────────────────

export function RegisterFormCard() {
  const { t } = useTranslation();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  const { handleRegister, loading, error, errorSeq } = useRegister();

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
        <Text style={styles.title}>{t('auth.register.title')}</Text>

        <DarkField
          label={t('auth.register.name')}
          icon="user"
          value={name}
          onChangeText={setName}
          placeholder={t('auth.register.name_placeholder')}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <DarkField
          label={t('auth.register.email')}
          icon="mail"
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.register.email_placeholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <DarkField
          label={t('auth.register.phone')}
          icon="phone"
          value={phone}
          onChangeText={setPhone}
          placeholder={t('auth.register.phone_placeholder')}
          keyboardType="phone-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <DarkField
          label={t('auth.register.password')}
          icon="lock"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <DarkField
          label={t('auth.register.confirm_password')}
          icon="check-circle"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="••••••••"
          secureTextEntry
        />

        <AuthFeedback error={error} />

        {/* Submit */}
        <Pressable
          onPress={() => handleRegister({ name, email, phone, password, confirm })}
          disabled={loading}
          style={({ pressed }) => [
            styles.submitBtn,
            pressed && styles.submitPressed,
            loading && styles.submitDisabled,
          ]}
        >
          <Text style={styles.submitText}>
            {loading ? t('auth.register.button_loading') : t('auth.register.button')}
          </Text>
          {!loading && <Feather name="arrow-right" size={18} color="#FFFFFF" />}
        </Pressable>

        {/* Login link */}
        <View style={styles.dividerLine} />
        <Pressable style={styles.navRow} onPress={() => router.back()}>
          <Text style={styles.navText}>{t('auth.register.already_have_account')}</Text>
          <Text style={styles.navLink}>{t('auth.register.login_link')}</Text>
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

  dividerLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
  navRow:      { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  navText:     { color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: 'Inter_400Regular' },
  navLink:     { color: '#C5A059', fontSize: 14, fontFamily: 'Inter_700Bold' },
});
