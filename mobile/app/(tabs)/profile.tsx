import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/shared/components/AppBackground';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Globe, Package, Settings, LogOut, Shield } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/shared/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAppStore } from '@/shared/store/appStore';
import { Language } from '@/shared/types';
import { colors } from '@/shared/constants/colors';

const LANGUAGES: Array<{ code: Language; native: string }> = [
  { code: 'pt', native: 'PT' },
  { code: 'en', native: 'EN' },
  { code: 'de', native: 'DE' },
];

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useAppStore();
  const { user }                   = useAuthStore();
  const { profile, loading }      = useProfile();
  const { logout, loading: loggingOut } = useLogout();

  const initials = profile?.name ? getInitials(profile.name) : '?';

  return (
    <AppBackground>
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-3 pb-2">
        <Text className="text-white text-2xl font-serif">{t('profile.title')}</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.brand.gold} />
        </View>
      ) : (
        <>
          {/* Avatar + identity */}
          <View className="items-center pt-4 pb-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: 'rgba(197,160,89,0.15)', borderWidth: 1.5, borderColor: 'rgba(197,160,89,0.35)' }}
            >
              <Text className="text-brand-gold text-2xl font-serif">{initials}</Text>
            </View>
            <Text className="text-white text-lg font-sans-bold">{profile?.name ?? '—'}</Text>
            <Text className="text-white/50 text-[13px] font-sans mt-1">{profile?.email ?? ''}</Text>
            {profile?.phone ? (
              <Text className="text-white/40 text-[12px] font-sans mt-0.5">{profile.phone}</Text>
            ) : null}
          </View>

          {/* Navigation menu */}
          <View
            className="mx-4 mb-4 rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'rgba(255,252,248,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
          >
            <Pressable
              className="flex-row items-center p-4 gap-3 active:opacity-70"
              style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' }}
              onPress={() => router.push('/profile/orders')}
            >
              <Package size={20} color={colors.brand.gold} />
              <Text className="flex-1 text-white text-[15px] font-sans">{t('profile.orders')}</Text>
              <ChevronRight size={18} color="rgba(255,255,255,0.25)" />
            </Pressable>
            <Pressable
              className="flex-row items-center p-4 gap-3 active:opacity-70"
              style={user?.role === 'admin' ? { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' } : {}}
              onPress={() => router.push('/profile/settings')}
            >
              <Settings size={20} color={colors.brand.gold} />
              <Text className="flex-1 text-white text-[15px] font-sans">{t('profile.settings')}</Text>
              <ChevronRight size={18} color="rgba(255,255,255,0.25)" />
            </Pressable>
            {user?.role === 'admin' && (
              <Pressable
                className="flex-row items-center p-4 gap-3 active:opacity-70"
                onPress={() => router.replace('/admin' as any)}
              >
                <Shield size={20} color={colors.brand.gold} />
                <Text className="flex-1 text-white text-[15px] font-sans">{t('profile.adminPanel')}</Text>
                <ChevronRight size={18} color="rgba(255,255,255,0.25)" />
              </Pressable>
            )}
          </View>

          {/* Language selector */}
          <View
            className="mx-4 mb-4 rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'rgba(255,252,248,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
          >
            <View
              className="flex-row items-center p-4 gap-3"
              style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' }}
            >
              <Globe size={20} color={colors.brand.gold} />
              <Text className="flex-1 text-white text-[15px] font-sans">{t('profile.language')}</Text>
            </View>
            <View className="flex-row p-3 gap-2">
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.code}
                  onPress={() => setLanguage(lang.code)}
                  className={`flex-1 py-[10px] rounded-xl items-center border ${
                    language === lang.code
                      ? 'bg-brand-gold border-brand-gold'
                      : 'border-white/20'
                  }`}
                >
                  <Text
                    className={`text-[13px] font-sans-medium ${
                      language === lang.code ? 'text-brand-green font-sans-bold' : 'text-white/50'
                    }`}
                  >
                    {lang.native}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Logout */}
          <Pressable
            className={`mx-4 flex-row items-center justify-center gap-2 py-4 rounded-2xl ${loggingOut ? 'opacity-50' : 'active:opacity-70'}`}
            style={{ borderWidth: 1, borderColor: 'rgba(232,180,34,0.35)' }}
            onPress={logout}
            disabled={loggingOut}
          >
            <LogOut size={18} color={colors.brand.terracotta} />
            <Text className="text-brand-terracotta text-[15px] font-sans-medium">
              {loggingOut ? t('profile.loggingOut') : t('profile.logout')}
            </Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
    </AppBackground>
  );
}
