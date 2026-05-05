import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(0,30,20,0.72)',
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.18)',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.45,
    shadowRadius: 48,
    elevation: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 4,
  },
});
