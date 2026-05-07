import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';

const PHOTO   = require('../../../assets/fotoBg.jpg');
const OVERLAY = 'rgba(0,28,14,0.75)';

export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground source={PHOTO} style={{ flex: 1 }} resizeMode="cover">
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: OVERLAY }]} pointerEvents="none" />
      {children}
    </ImageBackground>
  );
}
