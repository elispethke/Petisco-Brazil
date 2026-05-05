import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ProductFilter } from '@/data/products';

const FILTERS: Array<{ key: ProductFilter; emoji: string }> = [
  { key: 'all',     emoji: '🍽️' },
  { key: 'salgado', emoji: '🥟' },
  { key: 'combo',   emoji: '🎉' },
  { key: 'doce',    emoji: '🍫' },
  { key: 'bolo',    emoji: '🎂' },
];

interface CategoryFilterProps {
  selected: ProductFilter;
  onSelect: (filter: ProductFilter) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {FILTERS.map((f) => {
        const isActive = selected === f.key;
        return (
          <Pressable
            key={f.key}
            onPress={() => onSelect(f.key)}
            style={[styles.pill, isActive && styles.pillActive]}
          >
            <Text style={styles.emoji}>{f.emoji}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t(`categories.${f.key}`)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 4 },
  row: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.2)',
  },
  pillActive: {
    backgroundColor: '#B35C37',
    borderColor: '#B35C37',
    shadowColor: '#B35C37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: { fontSize: 15 },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  labelActive: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
});
