import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Color, Font, FontSize, Space } from '@/shared/theme/tokens';

export function AuthLogo() {
  const { t } = useTranslation();

  return (
    <View style={styles.block}>
      <Text style={styles.tagline}>{t('auth.tagline')}</Text>
      <Text style={styles.brand1}>Petisco</Text>
      <Text style={styles.brand2}>Brazil</Text>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  block:   { alignItems: 'center', marginBottom: Space[8] },
  tagline: {
    color: Color.gold,
    fontSize: FontSize.xs,
    letterSpacing: 4,
    textTransform: 'uppercase',
    fontFamily: Font.sansMedium,
    marginBottom: Space[2],
  },
  brand1:  { color: Color.white, fontSize: FontSize['5xl'], fontFamily: Font.serif, lineHeight: 56 },
  brand2:  { color: Color.gold,  fontSize: FontSize['5xl'], fontFamily: Font.serif, lineHeight: 56 },
  divider: { width: 48, height: 1, backgroundColor: `${Color.gold}80`, marginTop: Space[4] },
});
