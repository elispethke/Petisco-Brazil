import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/shared/store/authStore';
import { router } from 'expo-router';
import { colors } from '@/shared/constants/colors';

interface DeliveryOrder {
  id: string;
  customer_name: string;
  delivery_address: string;
  delivery_date: string;
  delivery_time: string;
  status: string;
  items_summary: string;
  total: number;
}

const STATUS_COLORS: Record<string, string> = {
  ready:            colors.brand.gold,
  out_for_delivery: '#004B5E',
  delivered:        '#22c55e',
};

const STATUS_LABELS: Record<string, string> = {
  ready:            'Pronto para entrega',
  out_for_delivery: 'Em rota',
  delivered:        'Entregue',
};

export default function DeliveryDashboard() {
  const { signOut: clearAuth } = useAuthStore();
  const [orders, setOrders]   = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('delivery-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['ready', 'out_for_delivery'])
      .order('delivery_date', { ascending: true });

    setOrders(data ?? []);
    setLoading(false);
  };

  const confirmPickup = async (orderId: string) => {
    await supabase.from('orders').update({ status: 'out_for_delivery' }).eq('id', orderId);
    fetchOrders();
  };

  const confirmDelivery = async (orderId: string) => {
    Alert.alert(
      'Confirmar entrega',
      'Confirmar que o pedido foi entregue?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            await supabase.from('orders').update({
              status:       'delivered',
              delivered_at: new Date().toISOString(),
            }).eq('id', orderId);
            fetchOrders();
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    await signOut(auth);
    clearAuth();
    router.replace('/auth/login' as any);
  };

  const renderOrder = ({ item }: { item: DeliveryOrder }) => (
    <View className="bg-brand-green-light rounded-[20px] p-5 border border-brand-gold/[.15] gap-[10px]">
      <View className="flex-row items-center justify-between">
        <View
          className="rounded-[20px] px-3 py-1"
          style={{ backgroundColor: STATUS_COLORS[item.status] ?? colors.brand.gold }}
        >
          <Text className="text-white text-[11px] font-sans-bold uppercase tracking-[0.5px]">
            {STATUS_LABELS[item.status] ?? item.status}
          </Text>
        </View>
        <Text className="text-white/[.35] text-xs font-sans">
          #{item.id.slice(0, 8).toUpperCase()}
        </Text>
      </View>

      <Text className="text-white text-lg font-serif">{item.customer_name}</Text>

      <View className="flex-row gap-2">
        <Text className="text-brand-gold text-xs font-sans-bold w-[72px]">Endereço</Text>
        <Text className="text-white/80 text-[13px] font-sans flex-1">{item.delivery_address}</Text>
      </View>
      <View className="flex-row gap-2">
        <Text className="text-brand-gold text-xs font-sans-bold w-[72px]">Data</Text>
        <Text className="text-white/80 text-[13px] font-sans flex-1">
          {item.delivery_date} · {item.delivery_time}
        </Text>
      </View>
      <View className="flex-row gap-2">
        <Text className="text-brand-gold text-xs font-sans-bold w-[72px]">Produtos</Text>
        <Text className="text-white/80 text-[13px] font-sans flex-1">{item.items_summary}</Text>
      </View>

      <View className="mt-1">
        {item.status === 'ready' && (
          <Pressable
            className="bg-brand-terracotta rounded-xl py-[13px] items-center active:opacity-80"
            onPress={() => confirmPickup(item.id)}
          >
            <Text className="text-white text-sm font-sans-bold">Confirmar retirada</Text>
          </Pressable>
        )}
        {item.status === 'out_for_delivery' && (
          <Pressable
            className="bg-green-800 rounded-xl py-[13px] items-center active:opacity-80"
            onPress={() => confirmDelivery(item.id)}
          >
            <Text className="text-white text-sm font-sans-bold">Confirmar entrega</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-brand-green" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pt-3 pb-4 border-b border-brand-gold/[.15]">
        <View>
          <Text className="text-brand-gold text-[11px] tracking-[3px] uppercase font-sans">
            Dashboard
          </Text>
          <Text className="text-white text-2xl font-serif mt-0.5">Minhas Entregas</Text>
        </View>
        <Pressable
          className="border border-brand-gold/30 rounded-[20px] px-4 py-[7px]"
          onPress={handleSignOut}
        >
          <Text className="text-brand-gold text-[13px] font-sans-medium">Sair</Text>
        </Pressable>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.brand.gold} size="large" />
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white/40 text-[15px] font-sans">Nenhuma entrega pendente</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 16, gap: 14 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
