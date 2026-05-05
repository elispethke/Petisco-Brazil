import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { CartItem as CartItemType } from '@/shared/types';
import { formatEuro } from '@/features/catalog/utils/pricing';
import { useAppStore } from '@/shared/store/appStore';
import type { Language } from '@/shared/types';
import { colors } from '@/shared/constants/colors';

interface CartItemCardProps {
  item: CartItemType;
  onRemove: (id: string) => void;
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  const { language } = useAppStore();
  const lang = language as Language;
  const name = item.product.name[lang] ?? item.product.name.pt;

  return (
    <View style={styles.row}>
      <Image
        source={item.product.image}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.qty}>{item.qty} unidades</Text>
        <Text style={styles.price}>{formatEuro(item.totalPrice)}</Text>
      </View>
      <Pressable
        onPress={() => onRemove(item.product.id)}
        style={styles.removeBtn}
        hitSlop={8}
      >
        <Trash2 size={16} color="#EF4444" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: { width: 64, height: 64, borderRadius: 12 },
  info: { flex: 1, marginHorizontal: 12 },
  name: {
    color: colors.brand.green,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  qty: {
    color: 'rgba(0,51,34,0.5)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  price: {
    color: colors.brand.terracotta,
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginTop: 4,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
