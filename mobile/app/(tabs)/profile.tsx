import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Globe, Package, Settings } from 'lucide-react-native';
import { useAppStore } from '@/shared/store/appStore';
import { Language } from '@/shared/types';
import { colors } from '@/shared/constants/colors';

const LANGUAGES: Array<{ code: Language; native: string }> = [
  { code: 'pt', native: 'Português' },
  { code: 'en', native: 'English' },
  { code: 'de', native: 'Deutsch' },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useAppStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.title')}</Text>
      </View>

      {/* Avatar placeholder */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>PB</Text>
      </View>

      {/* Menu */}
      <View style={styles.section}>
        <Pressable style={styles.menuItem}>
          <Package size={20} color={colors.brand.gold} />
          <Text style={styles.menuLabel}>{t('profile.orders')}</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
        </Pressable>
        <Pressable style={styles.menuItem}>
          <Settings size={20} color={colors.brand.gold} />
          <Text style={styles.menuLabel}>{t('profile.settings')}</Text>
          <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
        </Pressable>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <View style={styles.langHeader}>
          <Globe size={20} color={colors.brand.gold} />
          <Text style={styles.menuLabel}>{t('profile.language')}</Text>
        </View>
        <View style={styles.langRow}>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => setLanguage(lang.code)}
              style={[
                styles.langBtn,
                language === lang.code && styles.langBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.langText,
                  language === lang.code && styles.langTextActive,
                ]}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brand.green },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  title: { color: '#FFF', fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brand.greenLight,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(197,160,89,0.4)',
  },
  avatarText: { color: colors.brand.gold, fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold' },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.brand.greenLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.15)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197,160,89,0.1)',
  },
  menuLabel: { flex: 1, color: '#FFF', fontSize: 15, fontFamily: 'Inter_400Regular' },
  langHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197,160,89,0.1)',
  },
  langRow: { flexDirection: 'row', padding: 12, gap: 8 },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.2)',
  },
  langBtnActive: { backgroundColor: colors.brand.gold, borderColor: colors.brand.gold },
  langText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'Inter_500Medium' },
  langTextActive: { color: colors.brand.green, fontFamily: 'Inter_700Bold' },
});
