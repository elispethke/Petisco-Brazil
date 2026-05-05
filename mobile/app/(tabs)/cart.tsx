import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import { CartItemCard } from '@/features/checkout/components/CartItem';
import { useCartStore } from '@/shared/store/cartStore';
import { formatEuro } from '@/features/catalog/utils/pricing';

export default function CartScreen() {
  const { t } = useTranslation();
  const { items, removeItem, totalPrice, totalItems } = useCartStore((s) => ({
    items:      s.items,
    removeItem: s.removeItem,
    totalPrice: s.totalPrice(),
    totalItems: s.totalItems(),
  }));

  const isEmpty = items.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-brand-green" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
        <Text className="text-white text-2xl font-serif">{t('cart.title')}</Text>
        {!isEmpty && (
          <Text className="text-brand-gold text-sm font-sans-medium">{totalItems} unidades</Text>
        )}
      </View>

      {isEmpty ? (
        <View className="flex-1 items-center justify-center gap-4">
          <ShoppingCart size={64} color="rgba(197,160,89,0.3)" />
          <Text className="text-white/50 text-base font-sans">{t('cart.empty')}</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/catalog')}
            className="mt-2 bg-brand-terracotta px-6 py-3 rounded-xl active:opacity-80"
          >
            <Text className="text-white font-sans-bold text-[15px]">Ver Cardápio</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => `${item.product.id}-${item.qty}`}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 130 }}
            renderItem={({ item }) => (
              <CartItemCard item={item} onRemove={removeItem} />
            )}
          />
          <View className="absolute bottom-0 left-0 right-0 bg-brand-green border-t border-brand-gold/20 p-5 pb-8 gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-white/70 text-base font-sans">{t('cart.total')}</Text>
              <Text className="text-white text-2xl font-serif">{formatEuro(totalPrice)}</Text>
            </View>
            <Pressable
              onPress={() => router.push('/checkout')}
              className="bg-brand-terracotta rounded-2xl py-4 items-center active:opacity-80"
            >
              <Text className="text-white text-[17px] font-sans-bold">{t('cart.checkout')}</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
