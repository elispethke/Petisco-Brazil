import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/shared/store/authStore';
import { router } from 'expo-router';

const BRAND = {
  green: '#003322',
  greenLight: '#004433',
  gold: '#C5A059',
  terracotta: '#B35C37',
  white: '#FFFFFF',
} as const;

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
  ready: '#C5A059',
  out_for_delivery: '#004B5E',
  delivered: '#22c55e',
};

const STATUS_LABELS: Record<string, string> = {
  ready: 'Pronto para entrega',
  out_for_delivery: 'Em rota',
  delivered: 'Entregue',
};

export default function DeliveryDashboard() {
  const { user, signOut: clearAuth } = useAuthStore();
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
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
              status: 'delivered',
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
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] ?? BRAND.gold }]}>
          <Text style={styles.statusText}>{STATUS_LABELS[item.status] ?? item.status}</Text>
        </View>
        <Text style={styles.orderId}>#{item.id.slice(0, 8).toUpperCase()}</Text>
      </View>

      <Text style={styles.customerName}>{item.customer_name}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Endereço</Text>
        <Text style={styles.infoValue}>{item.delivery_address}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Data</Text>
        <Text style={styles.infoValue}>{item.delivery_date} · {item.delivery_time}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Produtos</Text>
        <Text style={styles.infoValue}>{item.items_summary}</Text>
      </View>

      <View style={styles.actionRow}>
        {item.status === 'ready' && (
          <Pressable style={styles.actionBtn} onPress={() => confirmPickup(item.id)}>
            <Text style={styles.actionBtnText}>Confirmar retirada</Text>
          </Pressable>
        )}
        {item.status === 'out_for_delivery' && (
          <Pressable style={[styles.actionBtn, styles.actionBtnGreen]} onPress={() => confirmDelivery(item.id)}>
            <Text style={styles.actionBtnText}>Confirmar entrega</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Dashboard</Text>
          <Text style={styles.headerTitle}>Minhas Entregas</Text>
        </View>
        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sair</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BRAND.gold} size="large" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nenhuma entrega pendente</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.green },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197,160,89,0.15)',
  },
  headerSub: { color: BRAND.gold, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'Inter_400Regular' },
  headerTitle: { color: BRAND.white, fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold', marginTop: 2 },
  signOutBtn: {
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  signOutText: { color: BRAND.gold, fontSize: 13, fontFamily: 'Inter_500Medium' },
  list: { padding: 16, gap: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Inter_400Regular' },
  orderCard: {
    backgroundColor: BRAND.greenLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.15)',
    gap: 10,
  },
  orderHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  statusText: { color: BRAND.white, fontSize: 11, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  orderId: { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter_400Regular' },
  customerName: { color: BRAND.white, fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold' },
  infoRow: { flexDirection: 'row', gap: 8 },
  infoLabel: { color: BRAND.gold, fontSize: 12, fontFamily: 'Inter_700Bold', width: 72 },
  infoValue: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_400Regular', flex: 1 },
  actionRow: { marginTop: 4 },
  actionBtn: {
    backgroundColor: BRAND.terracotta,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  actionBtnGreen: { backgroundColor: '#166534' },
  actionBtnText: { color: BRAND.white, fontSize: 14, fontFamily: 'Inter_700Bold' },
});
