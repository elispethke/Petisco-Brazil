import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/shared/components/AppBackground';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CategoryFilter } from '@/features/catalog/components/CategoryFilter';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { DynamicPricingSelector } from '@/features/catalog/components/DynamicPricingSelector';
import { useCatalog } from '@/features/catalog/hooks/useCatalog';
import { CATALOG_PRODUCTS } from '@/data/products';
import type { ProductFilter } from '@/data/products';
import type { CatalogProduct } from '@/shared/types';
import { useCartStore } from '@/shared/store/cartStore';

const FREQUENTLY_BOUGHT_IDS = ['combo_salgado', 'combo_misto', 'coxinha', 'brigadeiro', 'bolo_chocolate'];
const FREQUENTLY_BOUGHT = CATALOG_PRODUCTS.filter((p) => FREQUENTLY_BOUGHT_IDS.includes(p.id));

export default function CatalogScreen() {
  const { t } = useTranslation();
  const { products, filter, setFilter } = useCatalog();
  const params = useLocalSearchParams<{ category?: string }>();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [isSelectorOpen, setIsSelectorOpen]   = useState(false);

  const handleProductPress = useCallback((p: CatalogProduct) => {
    setSelectedProduct(p);
    setIsSelectorOpen(true);
  }, []);

  useEffect(() => {
    if (params.category) setFilter(params.category as ProductFilter);
  }, [params.category]);

  const countLabel = t(`catalog.count.${filter}`, { defaultValue: t('catalog.count.all') });

  const listHeader = useMemo(() => {
    if (filter !== 'all') return null;
    return (
      <View className="mb-6">
        <View className="flex-row items-center justify-between px-4 mb-[14px]">
          <Text className="text-white text-[15px] font-sans-bold tracking-[-0.2px]">
            {t('catalog.frequentlyBought', { defaultValue: 'Frequentemente juntos' })}
          </Text>
          <View className="w-[6px] h-[6px] rounded-full bg-brand-gold/50" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}
        >
          {FREQUENTLY_BOUGHT.map((p) => (
            <ProductCard key={p.id} product={p} compact onPress={handleProductPress} />
          ))}
        </ScrollView>
      </View>
    );
  }, [filter, t, handleProductPress]);

  return (
    <AppBackground>
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <StatusBar barStyle="light-content" />

      <View className="flex-row items-end justify-between px-5 pt-4 pb-5">
        <View>
          <Text className="text-brand-gold text-[11px] tracking-[3px] uppercase font-sans-medium mb-1">
            {t('catalog.eyebrow')}
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

      <View className="pb-4">
        <CategoryFilter selected={filter} onSelect={setFilter} />
      </View>

      <FlatList
        key={filter}
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 16 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <ProductCard product={item} fullWidth onPress={handleProductPress} />
        )}
        ListEmptyComponent={
          <View className="pt-20 items-center">
            <Text className="text-white/30 text-[15px] font-sans">
              {t('catalog.empty')}
            </Text>
          </View>
        }
      />

      {/* Conditionally mounted — component only exists in tree when actively open */}
      {isSelectorOpen && selectedProduct && (
        <DynamicPricingSelector
          product={selectedProduct}
          visible={true}
          onClose={() => setIsSelectorOpen(false)}
          onConfirm={({ product, quantity, price }) => {
            addItem(product, quantity, price);
            setIsSelectorOpen(false);
          }}
        />
      )}
    </SafeAreaView>
    </AppBackground>
  );
}
