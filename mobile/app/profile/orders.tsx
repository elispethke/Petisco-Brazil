import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/shared/components/AppBackground';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/shared/store/authStore';
import { getOrdersByUser } from '@/features/order/services/orderService';
import { formatEuro } from '@/features/catalog/utils/pricing';
import { colors } from '@/shared/constants/colors';
import type { FirestoreOrder, OrderStatus } from '@/shared/types';

// Status badge colors — brand tokens via inline style
const STATUS_BG: Record<OrderStatus, string> = {
  pending:    'rgba(197,160,89,0.15)',
  accepted:   'rgba(0,75,94,0.3)',
  delivering: 'rgba(232,180,34,0.2)',
  delivered:  'rgba(34,197,94,0.15)',
};
const STATUS_TEXT: Record<OrderStatus, string> = {
  pending:    colors.brand.gold,
  accepted:   colors.brand.petrol,
  delivering: colors.brand.terracotta,
  delivered:  '#22c55e',
};

function formatTimestamp(ts: unknown): string {
  if (!ts) return '—';
  if (typeof (ts as { toDate?: () => Date }).toDate === 'function') {
    return (ts as { toDate: () => Date }).toDate().toLocaleDateString('pt-BR');
  }
  return '—';
}

function OrderCard({ order }: { order: FirestoreOrder }) {
  const { t }         = useTranslation();
  const summary       = order.items.map((i) => `${i.name} ×${i.quantity}`).join(' · ');
  const statusLabel   = t(`orders.status.${order.status}`, { defaultValue: order.status });

  return (
    <View
      className="rounded-2xl p-4 gap-3"
      style={{ backgroundColor: 'rgba(255,252,248,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
    >
      {/* Status + date row */}
      <View className="flex-row items-center justify-between">
        <View
          className="rounded-xl px-3 py-[5px]"
          style={{ backgroundColor: STATUS_BG[order.status] }}
        >
          <Text
            className="text-[11px] font-sans-bold uppercase tracking-[0.5px]"
            style={{ color: STATUS_TEXT[order.status] }}
          >
            {statusLabel}
          </Text>
        </View>
        <Text className="text-white/35 text-xs font-sans">
          {order.deliveryDate ?? formatTimestamp(order.createdAt)}
        </Text>
      </View>

      {/* Items summary */}
      <Text className="text-white/70 text-[13px] font-sans leading-[18px]" numberOfLines={2}>
        {summary}
      </Text>

      {/* Total */}
      <View className="flex-row items-center justify-between">
        <Text className="text-white/40 text-xs font-sans">
          #{(order.id ?? '').slice(0, 8).toUpperCase()}
        </Text>
        <Text className="text-brand-gold text-lg font-serif tracking-[-0.3px]">
          {formatEuro(order.total)}
        </Text>
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const { t }         = useTranslation();
  const { user }      = useAuthStore();
  const [orders, setOrders]   = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    getOrdersByUser(user.uid)
      .then(setOrders)
      .catch(() => {/* silently fail — empty list shown */})
      .finally(() => setLoading(false));
  }, [user?.uid]);

  return (
    <AppBackground>
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      {/* Header */}
      <View
        className="flex-row items-center px-4 py-4 gap-3"
        style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full items-center justify-center active:opacity-70"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
        >
          <ArrowLeft size={20} color={colors.brand.gold} />
        </Pressable>
        <Text className="text-white text-lg font-serif flex-1">{t('orders.title')}</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.brand.gold} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OrderCard order={item} />}
          ListEmptyComponent={
            <View className="pt-24 items-center">
              <Text className="text-white/30 text-[15px] font-sans">{t('orders.empty')}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
    </AppBackground>
  );
}
