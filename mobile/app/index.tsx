import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, ImageBackground, Animated, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
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

// LinearGradient does not support className
const GRADIENT_STYLE = {
  flex: 1,
  paddingTop: 60,
  paddingBottom: 48,
  paddingHorizontal: 24,
  justifyContent: 'space-between' as const,
};

const ABS_FILL = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

export default function SplashScreen() {
  const { t } = useTranslation();
  const { language, setLanguage, setOnboarded } = useAppStore();

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY       = useRef(new Animated.Value(30)).current;
  const btnOpacity   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#003322');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(titleY,       { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
      Animated.timing(btnOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleStart = () => {
    setOnboarded(true);
    router.replace('/auth/login');
  };

  return (
    <View style={ABS_FILL}>
      <ImageBackground
        source={require('../assets/fotoBg.jpg')}
        style={ABS_FILL}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,51,34,0.25)', 'rgba(0,51,34,0.65)', 'rgba(0,51,34,0.96)']}
          style={GRADIENT_STYLE}
        >
          {/* Language selector */}
          <View className="flex-row justify-end gap-2">
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => setLanguage(lang.code)}
                className={`px-[14px] py-1.5 rounded-[20px] border ${
                  language === lang.code
                    ? 'bg-brand-gold border-brand-gold'
                    : 'border-white/30'
                }`}
              >
                <Text
                  className={`text-[13px] font-semibold ${
                    language === lang.code ? 'text-brand-green' : 'text-white/[.65]'
                  }`}
                >
                  {lang.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Title block */}
          <Animated.View
            className="items-center"
            style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}
          >
            <Text className="text-brand-gold text-[13px] tracking-[5px] uppercase mb-3 font-sans">
              {t('splash.welcome')}
            </Text>
            <Text className="text-white text-[58px] font-serif leading-[64px]">Petisco</Text>
            <Text className="text-brand-gold text-[58px] font-serif leading-[64px]">Brazil</Text>
            <View className="w-16 h-px bg-brand-gold/50 my-5" />
            <Text className="text-white/70 text-[15px] text-center font-sans leading-[22px]">
              {t('splash.tagline')}
            </Text>
          </Animated.View>

          {/* CTA */}
          <Animated.View style={{ opacity: btnOpacity }}>
            <Pressable
              onPress={handleStart}
              className="bg-brand-terracotta rounded-2xl py-[18px] items-center active:opacity-80"
            >
              <Text className="text-white text-[17px] font-sans-bold">
                {t('splash.start')}
              </Text>
            </Pressable>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
