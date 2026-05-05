import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { CategoryFilter } from '@/features/catalog/components/CategoryFilter';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { useCatalog } from '@/features/catalog/hooks/useCatalog';
import type { ProductFilter } from '@/data/products';

const CATEGORY_COUNT_LABELS: Record<string, string> = {
  all: 'produtos',
  salgado: 'salgados',
  combo: 'combos',
  doce: 'doces',
  bolo: 'bolos',
};

export default function CatalogScreen() {
  const { products, filter, setFilter } = useCatalog();
  const params = useLocalSearchParams<{ category?: string }>();

  useEffect(() => {
    if (params.category) setFilter(params.category as ProductFilter);
  }, [params.category]);

  const countLabel = CATEGORY_COUNT_LABELS[filter] ?? 'produtos';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>Cardápio</Text>
          <Text style={styles.headerTitle}>Petisco Brazil</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {products.length} {countLabel}
          </Text>
        </View>
      </View>

      {/* Category pills */}
      <View style={styles.filterWrapper}>
        <CategoryFilter selected={filter} onSelect={setFilter} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Product grid */}
      <FlatList
        key={filter}
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum produto nesta categoria</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003322' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerEyebrow: {
    color: '#C5A059',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: 'rgba(197,160,89,0.12)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.25)',
    marginBottom: 3,
  },
  countText: {
    color: '#C5A059',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  filterWrapper: {
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 14,
  },
  row: {
    gap: 14,
    justifyContent: 'space-between',
  },
  empty: {
    paddingTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
});
