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
            className={`flex-row items-center gap-[7px] px-[14px] py-[9px] rounded-full active:scale-[0.95] active:opacity-75 ${
              isActive
                ? 'bg-white'
                : 'bg-white/[.06] border border-white/[.08]'
            }`}
          >
            <Text className="text-[13px] leading-none">{f.emoji}</Text>
            <Text
              className={`text-[13px] ${
                isActive ? 'text-brand-green font-sans-bold' : 'text-white/50 font-sans'
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
