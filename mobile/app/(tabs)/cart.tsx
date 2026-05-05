import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import { CartItemCard } from '@/features/checkout/components/CartItem';
import { useCartStore } from '@/shared/store/cartStore';
import { formatEuro } from '@/features/catalog/utils/pricing';
import { colors } from '@/shared/constants/colors';

export default function CartScreen() {
  const { t } = useTranslation();
  const { items, removeItem, totalPrice, totalItems } = useCartStore((s) => ({
    items: s.items,
    removeItem: s.removeItem,
    totalPrice: s.totalPrice(),
    totalItems: s.totalItems(),
  }));

  const isEmpty = items.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('cart.title')}</Text>
        {!isEmpty && (
          <Text style={styles.count}>{totalItems} unidades</Text>
        )}
      </View>

      {isEmpty ? (
        <View style={styles.empty}>
          <ShoppingCart size={64} color="rgba(197,160,89,0.3)" />
          <Text style={styles.emptyText}>{t('cart.empty')}</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/catalog')}
            style={styles.shopBtn}
          >
            <Text style={styles.shopBtnText}>Ver Cardápio</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => `${item.product.id}-${item.qty}`}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <CartItemCard item={item} onRemove={removeItem} />
            )}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('cart.total')}</Text>
              <Text style={styles.totalValue}>{formatEuro(totalPrice)}</Text>
            </View>
            <Pressable
              onPress={() => router.push('/checkout')}
              style={styles.checkoutBtn}
            >
              <Text style={styles.checkoutBtnText}>{t('cart.checkout')}</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brand.green },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: { color: '#FFF', fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold' },
  count: { color: colors.brand.gold, fontSize: 14, fontFamily: 'Inter_500Medium' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  shopBtn: {
    marginTop: 8,
    backgroundColor: colors.brand.terracotta,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopBtnText: { color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 15 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 130 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.brand.green,
    borderTopWidth: 1,
    borderTopColor: 'rgba(197,160,89,0.2)',
    padding: 20,
    paddingBottom: 32,
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  totalValue: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  checkoutBtn: {
    backgroundColor: colors.brand.terracotta,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutBtnText: { color: '#FFF', fontSize: 17, fontFamily: 'Inter_700Bold' },
});
