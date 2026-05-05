import '../global.css';
import '../src/shared/i18n';

import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
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
import { supabase } from '@/lib/supabase';
import { useAuthStore, resolveRole } from '@/shared/store/authStore';

SplashScreen.preventAutoHideAsync();

// ─── Single source of truth for post-auth routing ─────────────────────────────

function navigateByRole(role: string) {
  if (role === 'delivery') {
    router.replace('/delivery');
  } else {
    // admin, production, customer — all access (tabs)
    router.replace('/(tabs)');
  }
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout() {
  const { setUser, isLoading } = useAuthStore();

  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      // Admin email always gets admin role — no Supabase dependency
      const email = firebaseUser.email ?? '';
      const ADMIN_EMAIL = 'elispethke@gmail.com';

      let dbRole: string | undefined;

      if (email !== ADMIN_EMAIL) {
        // Only query Supabase for non-admin users
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('firebase_uid', firebaseUser.uid)
          .single();
        dbRole = profile?.role;
      }

      const role = resolveRole(email, dbRole);

      setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role });

      // Navigate immediately — this fires on login AND on app restart with saved session
      navigateByRole(role);
    });

    return unsubscribe;
  }, []);

  if ((!fontsLoaded && !fontError) || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#003322', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#C5A059" size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="delivery/index" />
        <Stack.Screen name="checkout" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
