import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  StyleSheet,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/shared/store/appStore';
import type { Language } from '@/shared/types';

const LANGUAGES: Array<{ code: Language; label: string }> = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
];

export default function SplashScreen() {
  const { t } = useTranslation();
  const { language, setLanguage, setOnboarded } = useAppStore();

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(btnOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    setOnboarded(true);
    router.replace('/auth/login');
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <ImageBackground
        source={require('../assets/fotoBg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(0,51,34,0.25)',
            'rgba(0,51,34,0.65)',
            'rgba(0,51,34,0.96)',
          ]}
          style={styles.gradient}
        >
          {/* Language selector */}
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
                  {lang.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Title block */}
          <Animated.View
            style={[
              styles.titleBlock,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleY }],
              },
            ]}
          >
            <Text style={styles.welcome}>{t('splash.welcome')}</Text>
            <Text style={styles.titleLine1}>Petisco</Text>
            <Text style={styles.titleLine2}>Brazil</Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>{t('splash.tagline')}</Text>
          </Animated.View>

          {/* CTA */}
          <Animated.View style={{ opacity: btnOpacity }}>
            <Pressable onPress={handleStart} style={styles.ctaBtn}>
              <Text style={styles.ctaBtnText}>{t('splash.start')}</Text>
            </Pressable>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  langBtnActive: {
    backgroundColor: '#C5A059',
    borderColor: '#C5A059',
  },
  langText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '600',
  },
  langTextActive: {
    color: '#003322',
  },
  titleBlock: {
    alignItems: 'center',
  },
  welcome: {
    color: '#C5A059',
    fontSize: 13,
    letterSpacing: 5,
    textTransform: 'uppercase',
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },
  titleLine1: {
    color: '#FFFFFF',
    fontSize: 58,
    fontFamily: 'PlayfairDisplay_700Bold',
    lineHeight: 64,
  },
  titleLine2: {
    color: '#C5A059',
    fontSize: 58,
    fontFamily: 'PlayfairDisplay_700Bold',
    lineHeight: 64,
  },
  divider: {
    width: 64,
    height: 1,
    backgroundColor: 'rgba(197,160,89,0.5)',
    marginVertical: 20,
  },
  tagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  ctaBtn: {
    backgroundColor: '#B35C37',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
});
