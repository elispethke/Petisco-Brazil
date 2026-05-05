import React, { useEffect, useRef } from 'react';
import {
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W, height: H } = Dimensions.get('window');

// Used for LinearGradient (does not support className) and dynamic smoke layers
const ABS_FILL = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };
const SMOKE_LAYER = { ...ABS_FILL, width: W * 1.3, height: H * 1.2 };

interface AuthLayoutProps {
  children: React.ReactNode;
}

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
      <LinearGradient
        colors={['rgba(0,51,34,0.18)', 'rgba(0,51,34,0.60)', 'rgba(0,20,13,0.92)']}
        style={ABS_FILL}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <Animated.View style={[SMOKE_LAYER, { opacity: op1, transform: [{ translateX: tx1 }] }]}>
        <LinearGradient
          colors={['transparent', 'rgba(0,80,50,0.55)', 'transparent']}
          style={ABS_FILL}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        />
      </Animated.View>
      <Animated.View style={[SMOKE_LAYER, { opacity: op2, transform: [{ translateY: ty2 }] }]}>
        <LinearGradient
          colors={['transparent', 'rgba(197,160,89,0.18)', 'transparent']}
          style={ABS_FILL}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 1, y: 0.7 }}
        />
      </Animated.View>
      <Animated.View style={[SMOKE_LAYER, { opacity: op3 }]}>
        <LinearGradient
          colors={['rgba(0,51,34,0.4)', 'transparent', 'rgba(0,51,34,0.4)']}
          style={ABS_FILL}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </>
  );
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <View className="flex-1">
      <ImageBackground
        source={require('../../../../assets/fotoBg.jpg')}
        style={ABS_FILL}
        resizeMode="cover"
      />
      <SmokeyOverlay />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 48,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
