import React from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
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
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
      className="py-1"
    >
      {FILTERS.map((f) => {
        const isActive = selected === f.key;
        return (
          <Pressable
            key={f.key}
            onPress={() => onSelect(f.key)}
            className={`flex-row items-center gap-1.5 px-4 py-[10px] rounded-full border ${
              isActive
                ? 'bg-brand-terracotta border-brand-terracotta shadow-md'
                : 'bg-white/[.07] border-brand-gold/20'
            }`}
          >
            <Text className="text-[15px]">{f.emoji}</Text>
            <Text
              className={`text-[13px] ${
                isActive ? 'text-white font-sans-bold' : 'text-white/60 font-sans-medium'
              }`}
            >
              {t(`categories.${f.key}`)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
