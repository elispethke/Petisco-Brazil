import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/shared/components/AppBackground';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/shared/store/authStore';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { colors } from '@/shared/constants/colors';

const INPUT_STYLE = {
  backgroundColor: 'rgba(255,252,248,0.12)',
  borderWidth:     1,
  borderColor:     'rgba(255,255,255,0.12)',
  borderRadius:    12,
  paddingHorizontal: 14,
  paddingVertical:   12,
  color:           '#FFFFFF',
  fontSize:        15,
  fontFamily:      'Inter_400Regular',
} as const;

export default function SettingsScreen() {
  const { t }             = useTranslation();
  const { user }          = useAuthStore();
  const { profile, loading, update } = useProfile();

  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [address, setAddress] = useState('');
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name    ?? '');
      setPhone(profile.phone  ?? '');
      setAddress(profile.address ?? '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('', 'O nome não pode estar vazio.');
      return;
    }
    setSaving(true);
    try {
      await update({ name: name.trim(), phone: phone.trim(), address: address.trim() });
      Alert.alert('', 'Perfil atualizado com sucesso!');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const isCustomer = user?.role === 'customer';

  return (
    <AppBackground>
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      {/* Header */}
      <View
        className="flex-row items-center px-4 py-4 gap-3"
        style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full items-center justify-center active:opacity-70"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
        >
          <ArrowLeft size={20} color={colors.brand.gold} />
        </Pressable>
        <Text className="text-white text-lg font-serif flex-1">{t('profile.settings')}</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.brand.gold} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ padding: 16, gap: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Personal data */}
            <View>
              <Text className="text-white/40 text-[11px] font-sans-medium uppercase tracking-[1px] mb-3">
                Dados pessoais
              </Text>
              <View
                className="rounded-2xl overflow-hidden gap-0"
                style={{ backgroundColor: 'rgba(255,252,248,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
              >
                {/* Name */}
                <View
                  className="px-4 pt-3 pb-3"
                  style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' }}
                >
                  <Text className="text-white/40 text-[11px] font-sans-medium mb-1">{t('profile.name').toUpperCase()}</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    style={{ color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_400Regular' }}
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    placeholder={t('profile.name')}
                  />
                </View>
                {/* Phone */}
                <View
                  className="px-4 pt-3 pb-3"
                  style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' }}
                >
                  <Text className="text-white/40 text-[11px] font-sans-medium mb-1">{t('profile.phone').toUpperCase()}</Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    style={{ color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_400Regular' }}
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    placeholder="+49 176 000 0000"
                    keyboardType="phone-pad"
                  />
                </View>
                {/* Address */}
                <View className="px-4 pt-3 pb-3">
                  <Text className="text-white/40 text-[11px] font-sans-medium mb-1">{t('profile.address').toUpperCase()}</Text>
                  <TextInput
                    value={address}
                    onChangeText={setAddress}
                    style={{ color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_400Regular' }}
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    placeholder="Musterstraße 1, 10115 Berlin"
                  />
                </View>
              </View>
            </View>

            {/* Save button */}
            <Pressable
              onPress={handleSave}
              disabled={saving}
              className={`bg-brand-terracotta rounded-2xl py-4 items-center ${saving ? 'opacity-60' : 'active:opacity-80'}`}
            >
              <Text className="text-white text-[15px] font-sans-bold">
                {saving ? t('profile.saving') : t('profile.save')}
              </Text>
            </Pressable>

            {/* Become Driver — only for customers */}
            {isCustomer && (
              <View>
                <Text className="text-white/40 text-[11px] font-sans-medium uppercase tracking-[1px] mb-3">
                  Conta
                </Text>
                <Pressable
                  onPress={() => router.push('/auth/driver-register')}
                  className="flex-row items-center p-4 rounded-2xl active:opacity-70"
                  style={{ backgroundColor: 'rgba(255,252,248,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
                >
                  <Text className="flex-1 text-white text-[15px] font-sans">{t('profile.becomeDriver')}</Text>
                  <Text className="text-white/30 text-lg">→</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
    </AppBackground>
  );
}
