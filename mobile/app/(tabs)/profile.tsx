import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Globe, Package, Settings } from 'lucide-react-native';
import { useAppStore } from '@/shared/store/appStore';
import { Language } from '@/shared/types';
import { colors } from '@/shared/constants/colors';

const LANGUAGES: Array<{ code: Language; native: string }> = [
  { code: 'pt', native: 'Português' },
  { code: 'en', native: 'English'   },
  { code: 'de', native: 'Deutsch'   },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useAppStore();

  return (
    <SafeAreaView className="flex-1 bg-brand-green" edges={['top']}>
      <View className="px-5 pt-3 pb-4">
        <Text className="text-white text-2xl font-serif">{t('profile.title')}</Text>
      </View>

      <View className="w-20 h-20 rounded-full bg-brand-green-light self-center items-center justify-center mb-8 border-2 border-brand-gold/40">
        <Text className="text-brand-gold text-2xl font-serif">PB</Text>
      </View>

      <View className="mx-4 mb-4 bg-brand-green-light rounded-2xl border border-brand-gold/[.15] overflow-hidden">
        <Pressable className="flex-row items-center p-4 gap-3 border-b border-brand-gold/10">
          <Package size={20} color={colors.brand.gold} />
          <Text className="flex-1 text-white text-[15px] font-sans">{t('profile.orders')}</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
        </Pressable>
        <Pressable className="flex-row items-center p-4 gap-3">
          <Settings size={20} color={colors.brand.gold} />
          <Text className="flex-1 text-white text-[15px] font-sans">{t('profile.settings')}</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
        </Pressable>
      </View>

      <View className="mx-4 bg-brand-green-light rounded-2xl border border-brand-gold/[.15] overflow-hidden">
        <View className="flex-row items-center p-4 gap-3 border-b border-brand-gold/10">
          <Globe size={20} color={colors.brand.gold} />
          <Text className="flex-1 text-white text-[15px] font-sans">{t('profile.language')}</Text>
        </View>
        <View className="flex-row p-3 gap-2">
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => setLanguage(lang.code)}
              className={`flex-1 py-[10px] rounded-[10px] items-center border ${
                language === lang.code
                  ? 'bg-brand-gold border-brand-gold'
                  : 'border-brand-gold/20'
              }`}
            >
              <Text
                className={`text-[13px] font-sans-medium ${
                  language === lang.code ? 'text-brand-green font-sans-bold' : 'text-white/60'
                }`}
              >
                {lang.native}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
