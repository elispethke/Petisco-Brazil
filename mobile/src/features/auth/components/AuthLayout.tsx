import React, { useEffect, useRef } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W, height: H } = Dimensions.get('window');

interface AuthLayoutProps {
  children: React.ReactNode;
}

// ── Animated smoky overlay — mimics the WebGL shader with layered gradients ──

function SmokeyOverlay() {
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  const a3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val: Animated.Value, duration: number, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration, useNativeDriver: true }),
        ]),
      );

    Animated.parallel([
      loop(a1, 7000, 0),
      loop(a2, 9000, 2000),
      loop(a3, 11000, 4500),
    ]).start();
  }, []);

  const op1 = a1.interpolate({ inputRange: [0, 1], outputRange: [0.0, 0.35] });
  const op2 = a2.interpolate({ inputRange: [0, 1], outputRange: [0.0, 0.28] });
  const op3 = a3.interpolate({ inputRange: [0, 1], outputRange: [0.0, 0.22] });

  const tx1 = a1.interpolate({ inputRange: [0, 1], outputRange: [0, W * 0.15] });
  const ty2 = a2.interpolate({ inputRange: [0, 1], outputRange: [0, H * 0.08] });

  return (
    <>
      {/* Base dark overlay */}
      <LinearGradient
        colors={['rgba(0,51,34,0.18)', 'rgba(0,51,34,0.60)', 'rgba(0,20,13,0.92)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Smoke layer 1 — drifts horizontally */}
      <Animated.View
        style={[
          styles.smokeLayer,
          { opacity: op1, transform: [{ translateX: tx1 }] },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,80,50,0.55)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        />
      </Animated.View>

      {/* Smoke layer 2 — drifts vertically */}
      <Animated.View
        style={[
          styles.smokeLayer,
          { opacity: op2, transform: [{ translateY: ty2 }] },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(197,160,89,0.18)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 1, y: 0.7 }}
        />
      </Animated.View>

      {/* Smoke layer 3 — ambient pulse */}
      <Animated.View style={[styles.smokeLayer, { opacity: op3 }]}>
        <LinearGradient
          colors={['rgba(0,51,34,0.4)', 'transparent', 'rgba(0,51,34,0.4)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../../../assets/fotoBg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SmokeyOverlay />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1 },
  kav:   { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  smokeLayer: {
    ...StyleSheet.absoluteFillObject,
    width: W * 1.3,
    height: H * 1.2,
  },
});
