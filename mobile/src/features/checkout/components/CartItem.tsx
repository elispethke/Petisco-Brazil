import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { CartItem as CartItemType } from '@/shared/types';
import { formatEuro } from '@/features/catalog/utils/pricing';
import { useAppStore } from '@/shared/store/appStore';
import type { Language } from '@/shared/types';

interface CartItemCardProps {
  item: CartItemType;
  onRemove: (id: string) => void;
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  const { language } = useAppStore();
  const lang = language as Language;
  const name = item.product.name[lang] ?? item.product.name.pt;

  return (
    <View className="flex-row items-center bg-white rounded-2xl p-3 mb-[10px] border border-brand-gold/[.15] shadow-sm">
      <Image
        source={item.product.image}
        className="w-16 h-16 rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-1 mx-3">
        <Text className="text-brand-green text-sm font-sans-bold" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-brand-green/50 text-xs font-sans mt-0.5">
          {item.qty} unidades
        </Text>
        <Text className="text-brand-terracotta text-base font-serif mt-1">
          {formatEuro(item.totalPrice)}
        </Text>
      </View>
      <Pressable
        onPress={() => onRemove(item.product.id)}
        className="w-8 h-8 rounded-full bg-red-100 items-center justify-center"
        hitSlop={8}
      >
        <Trash2 size={16} color="#EF4444" />
      </Pressable>
    </View>
  );
}
