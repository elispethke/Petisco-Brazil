import React, { useEffect } from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { CategoryFilter } from '@/features/catalog/components/CategoryFilter';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { useCatalog } from '@/features/catalog/hooks/useCatalog';
import type { ProductFilter } from '@/data/products';

const CATEGORY_COUNT_LABELS: Record<string, string> = {
  all:     'produtos',
  salgado: 'salgados',
  combo:   'combos',
  doce:    'doces',
  bolo:    'bolos',
};

export default function CatalogScreen() {
  const { products, filter, setFilter } = useCatalog();
  const params = useLocalSearchParams<{ category?: string }>();

  useEffect(() => {
    if (params.category) setFilter(params.category as ProductFilter);
  }, [params.category]);

  const countLabel = CATEGORY_COUNT_LABELS[filter] ?? 'produtos';

  return (
    <SafeAreaView className="flex-1 bg-brand-green" edges={['top']}>
      <StatusBar barStyle="light-content" />

      <View className="flex-row items-end justify-between px-5 pt-2 pb-4">
        <View>
          <Text className="text-brand-gold text-[11px] tracking-[3px] uppercase font-sans-medium mb-1">
            Cardápio
          </Text>
          <Text className="text-white text-[28px] font-serif tracking-[-0.5px]">
            Petisco Brazil
          </Text>
        </View>
        <View className="bg-brand-gold/[.12] rounded-[20px] px-3 py-[5px] border border-brand-gold/25 mb-[3px]">
          <Text className="text-brand-gold text-xs font-sans-medium">
            {products.length} {countLabel}
          </Text>
        </View>
      </View>

      <View className="pb-2">
        <CategoryFilter selected={filter} onSelect={setFilter} />
      </View>

      <View className="h-px bg-white/[.06] mx-4 mb-4" />

      <FlatList
        key={filter}
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 14, justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 14 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <View className="pt-20 items-center">
            <Text className="text-white/30 text-[15px] font-sans">
              Nenhum produto nesta categoria
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
