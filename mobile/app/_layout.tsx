import '../global.css';
import '../src/shared/i18n';

import React, { useEffect, useRef } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getOrCreateUserDoc } from '@/features/auth/services/userService';
import { useAuthStore } from '@/shared/store/authStore';
import { getRoute } from '@/shared/utils/getRoute';

SplashScreen.preventAutoHideAsync();

const BRAND_GREEN = '#003322';

export default function RootLayout() {
  const { user, setUser, isLoading } = useAuthStore();
  const splashHidden  = useRef(false);
  const authResolved  = useRef(false);

  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  // Match Android navigation bar (bottom system bar) to brand color.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NavigationBar.setBackgroundColorAsync(BRAND_GREEN);
    NavigationBar.setButtonStyleAsync('light');
  }, []);

  // Auth listener — sets Zustand state only, never navigates directly.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }
      try {
        const userDoc = await getOrCreateUserDoc(
          firebaseUser.uid,
          firebaseUser.email ?? '',
        );
        setUser({
          uid:    firebaseUser.uid,
          email:  firebaseUser.email,
          role:   userDoc.role,
          status: userDoc.status,
        });
      } catch {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading || (!fontsLoaded && !fontError)) return;

    if (user) {
      // Authenticated: route directly to the correct screen.
      router.replace(getRoute(user) as any);
    } else if (authResolved.current) {
      // Subsequent logout after a valid session — go to login, not splash.
      router.replace('/auth/login' as any);
    }
    // First resolution with no user: stay on splash (index.tsx).
    // The user taps "Começar" to navigate to login manually.
    authResolved.current = true;

    if (!splashHidden.current) {
      splashHidden.current = true;
      SplashScreen.hideAsync();
    }
  }, [user?.uid, user?.role, user?.status, isLoading, fontsLoaded, fontError]);

  return (
    <View style={{ flex: 1, backgroundColor: BRAND_GREEN }}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: BRAND_GREEN } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/pending" />
        <Stack.Screen name="auth/driver-register" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="delivery/index" />
        <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
        <Stack.Screen name="profile/orders" />
        <Stack.Screen name="profile/settings" />
      </Stack>
    </View>
  );
}
