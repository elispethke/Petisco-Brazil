import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/shared/components/AppBackground';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/shared/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import {
  subscribeToDrivers,
  updateUserStatus,
} from '@/features/auth/services/userService';
import {
  subscribeToAllOrders,
  assignDriver,
  updateOrderStatus,
} from '@/features/order/services/orderService';
import { formatEuro } from '@/features/catalog/utils/pricing';
import { colors } from '@/shared/constants/colors';
import type { AppUser } from '@/features/auth/services/userService';
import type { FirestoreOrder, OrderStatus } from '@/shared/types';

// ─── Constants ───────────────────────────────────────────────────────────────

type Tab         = 'drivers' | 'orders';
type OrderFilter = 'all' | OrderStatus;

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending:    colors.brand.gold,
  accepted:   colors.brand.petrol,
  delivering: colors.brand.terracotta,
  delivered:  '#22c55e',
};
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    'Aguardando',
  accepted:   'Aceito',
  delivering: 'Em rota',
  delivered:  'Entregue',
};
const DRIVER_STATUS_COLOR: Record<string, string> = {
  pending:  colors.brand.gold,
  approved: '#22c55e',
  blocked:  colors.brand.terracotta,
};
const DRIVER_STATUS_LABEL: Record<string, string> = {
  pending:  'Pendente',
  approved: 'Aprovado',
  blocked:  'Bloqueado',
};
const VEHICLE_LABEL: Record<string, string> = {
  car:        'Carro',
  motorcycle: 'Moto',
  bicycle:    'Bicicleta',
};

// ─── Glass card wrapper ───────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="rounded-2xl p-4 gap-3"
      style={{
        backgroundColor: 'rgba(255,252,248,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
      }}
    >
      {children}
    </View>
  );
}

// ─── Driver card ─────────────────────────────────────────────────────────────

function DriverCard({
  driver,
  onApprove,
  onBlock,
}: {
  driver: AppUser;
  onApprove: () => void;
  onBlock: () => void;
}) {
  const statusColor = DRIVER_STATUS_COLOR[driver.status] ?? colors.brand.gold;
  const statusLabel = DRIVER_STATUS_LABEL[driver.status] ?? driver.status;

  return (
    <Card>
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-[15px] font-sans-medium flex-1" numberOfLines={1}>
          {driver.name}
        </Text>
        <View
          className="rounded-xl px-2 py-[3px] ml-2"
          style={{ backgroundColor: `${statusColor}22` }}
        >
          <Text className="text-[11px] font-sans-bold" style={{ color: statusColor }}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View className="gap-1">
        {/* Online status */}
        <View className="flex-row gap-2 items-center">
          <Text className="text-white/40 text-xs font-sans w-[72px]">Disponível</Text>
          <View className="flex-row items-center gap-1">
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: driver.isOnline ? '#22c55e' : 'rgba(255,255,255,0.25)' }}
            />
            <Text
              className="text-xs font-sans-medium"
              style={{ color: driver.isOnline ? '#22c55e' : 'rgba(255,255,255,0.35)' }}
            >
              {driver.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        <Row label="Telefone"  value={driver.phone   ?? '—'} />
        <Row label="Veículo"   value={VEHICLE_LABEL[driver.vehicleType ?? ''] ?? '—'} />
        {driver.plateNumber ? <Row label="Placa" value={driver.plateNumber} /> : null}
      </View>

      {driver.status !== 'approved' && (
        <Pressable
          className="rounded-xl py-[11px] items-center active:opacity-80"
          style={{ backgroundColor: '#166534' }}
          onPress={onApprove}
        >
          <Text className="text-white text-sm font-sans-bold">Aprovar</Text>
        </Pressable>
      )}
      {driver.status !== 'blocked' && (
        <Pressable
          className="rounded-xl py-[11px] items-center active:opacity-80"
          style={{
            backgroundColor: 'rgba(232,180,34,0.15)',
            borderWidth: 1,
            borderColor: 'rgba(232,180,34,0.35)',
          }}
          onPress={onBlock}
        >
          <Text className="text-brand-terracotta text-sm font-sans-bold">Bloquear</Text>
        </Pressable>
      )}
    </Card>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  drivers,
  onAssign,
  onAdvance,
}: {
  order:    FirestoreOrder;
  drivers:  AppUser[];
  onAssign: (driverId: string) => void;
  onAdvance: () => void;
}) {
  const [pickerVisible,  setPickerVisible]  = useState(false);
  const approvedDrivers  = drivers.filter((d) => d.status === 'approved');
  const assignedDriver   = drivers.find((d) => d.id === order.assignedDriverId);

  const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    accepted:   'delivering',
    delivering: 'delivered',
  };
  const ADVANCE_LABEL: Partial<Record<OrderStatus, string>> = {
    accepted:   'Marcar em rota',
    delivering: 'Confirmar entrega',
  };

  const nextStatus = NEXT_STATUS[order.status];
  const canAssign  = order.status === 'pending';

  return (
    <>
      <Card>
        <View className="flex-row items-center justify-between">
          <View
            className="rounded-xl px-3 py-[5px]"
            style={{ backgroundColor: `${STATUS_COLOR[order.status]}22` }}
          >
            <Text
              className="text-[11px] font-sans-bold uppercase tracking-[0.5px]"
              style={{ color: STATUS_COLOR[order.status] }}
            >
              {STATUS_LABEL[order.status]}
            </Text>
          </View>
          <Text className="text-white/35 text-xs font-sans">
            #{order.id.slice(0, 8).toUpperCase()}
          </Text>
        </View>

        <View className="gap-1">
          <Row label="Itens"  value={`${order.items.length} produto(s)`} />
          <Row label="Total"  value={formatEuro(order.total)} />
          {order.deliveryDate ? (
            <Row
              label="Entrega"
              value={`${order.deliveryDate}${order.deliveryTime ? ` · ${order.deliveryTime}` : ''}`}
            />
          ) : null}
          {order.address ? (
            <Row
              label="Endereço"
              value={`${order.address.street}${order.address.number ? ` ${order.address.number}` : ''}, ${order.address.city}`}
            />
          ) : null}
          {order.assignedDriverId ? (
            <Row
              label="Motorista"
              value={assignedDriver?.name ?? order.assignedDriverId.slice(0, 8)}
            />
          ) : null}
        </View>

        <View className="gap-2">
          {canAssign && (
            <Pressable
              className="rounded-xl py-[11px] items-center active:opacity-80"
              style={{
                backgroundColor: 'rgba(0,75,94,0.25)',
                borderWidth: 1,
                borderColor: 'rgba(0,75,94,0.5)',
              }}
              onPress={() => setPickerVisible(true)}
            >
              <Text className="text-white text-sm font-sans-bold">Atribuir motorista</Text>
            </Pressable>
          )}
          {nextStatus && (
            <Pressable
              className="rounded-xl py-[11px] items-center active:opacity-80"
              style={{ backgroundColor: 'rgba(197,160,89,0.15)', borderWidth: 1, borderColor: 'rgba(197,160,89,0.35)' }}
              onPress={onAdvance}
            >
              <Text className="text-brand-gold text-sm font-sans-bold">
                {ADVANCE_LABEL[order.status]}
              </Text>
            </Pressable>
          )}
        </View>
      </Card>

      {/* Driver picker modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <SafeAreaView
            edges={['bottom']}
            style={{ backgroundColor: '#071F10', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }}
          >
            <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
              <Text className="text-white text-base font-serif">Selecionar motorista</Text>
              <Pressable onPress={() => setPickerVisible(false)} className="active:opacity-70">
                <Text className="text-white/50 text-sm font-sans">Cancelar</Text>
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 320 }} contentContainerStyle={{ padding: 16, gap: 10 }}>
              {approvedDrivers.length === 0 ? (
                <Text className="text-white/40 text-sm font-sans text-center py-6">
                  Nenhum motorista aprovado disponível
                </Text>
              ) : (
                approvedDrivers.map((driver) => (
                  <Pressable
                    key={driver.id}
                    className="flex-row items-center p-3 rounded-xl active:opacity-70"
                    style={{
                      backgroundColor: 'rgba(255,252,248,0.12)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.10)',
                    }}
                    onPress={() => {
                      setPickerVisible(false);
                      onAssign(driver.id);
                    }}
                  >
                    <View className="flex-1">
                      <Text className="text-white text-[14px] font-sans-medium">{driver.name}</Text>
                      <Text className="text-white/40 text-xs font-sans mt-0.5">
                        {VEHICLE_LABEL[driver.vehicleType ?? ''] ?? '—'}
                        {driver.isOnline ? '  ·  Online' : ''}
                      </Text>
                    </View>
                    <Text className="text-brand-gold text-lg">→</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

// ─── Small helper ─────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row gap-2">
      <Text className="text-white/40 text-xs font-sans w-[72px]">{label}</Text>
      <Text className="text-white/80 text-xs font-sans flex-1">{value}</Text>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function AdminScreen() {
  const router = useRouter();
  const { logout, loading: loggingOut } = useLogout();
  const [tab,         setTab]         = useState<Tab>('orders');
  const [drivers,     setDrivers]     = useState<AppUser[]>([]);
  const [orders,      setOrders]      = useState<FirestoreOrder[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all');

  useEffect(() => {
    let driversReady = false;
    let ordersReady  = false;

    const markReady = () => {
      if (driversReady && ordersReady) setLoading(false);
    };

    const unsubDrivers = subscribeToDrivers((data) => {
      setDrivers(data);
      driversReady = true;
      markReady();
    });
    const unsubOrders = subscribeToAllOrders((data) => {
      setOrders(data);
      ordersReady = true;
      markReady();
    });

    return () => { unsubDrivers(); unsubOrders(); };
  }, []);

  const filteredOrders  = orderFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === orderFilter);

  const handleApprove = (uid: string) => updateUserStatus(uid, 'approved');
  const handleBlock   = (uid: string) => {
    Alert.alert('Bloquear motorista', 'Confirmar bloqueio?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Bloquear', style: 'destructive', onPress: () => updateUserStatus(uid, 'blocked') },
    ]);
  };

  const handleAssign = async (orderId: string, driverId: string) => {
    try {
      await assignDriver(orderId, driverId);
    } catch {
      Alert.alert('Erro', 'Não foi possível atribuir o motorista.');
    }
  };

  const handleAdvance = async (order: FirestoreOrder) => {
    const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
      accepted: 'delivering',
      delivering: 'delivered',
    };
    const next = NEXT[order.status];
    if (!next) return;
    try {
      await updateOrderStatus(order.id, next);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    }
  };

  return (
    <AppBackground>
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-5 pt-3 pb-4"
        style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}
      >
        <View>
          <Text className="text-brand-gold text-[11px] tracking-[3px] uppercase font-sans">
            Petisco Brazil
          </Text>
          <Text className="text-white text-2xl font-serif mt-0.5">Painel Admin</Text>
        </View>
        <View className="gap-2 items-end">
          <Pressable
            className="border rounded-xl px-3 py-[5px] active:opacity-70"
            style={{ borderColor: 'rgba(197,160,89,0.40)' }}
            onPress={() => router.replace('/(tabs)' as any)}
          >
            <Text className="text-brand-gold text-xs font-sans-bold">Ir para o App</Text>
          </Pressable>
          <Pressable
            className={`border rounded-xl px-3 py-[5px] ${loggingOut ? 'opacity-50' : 'active:opacity-70'}`}
            style={{ borderColor: 'rgba(232,180,34,0.50)' }}
            onPress={logout}
            disabled={loggingOut}
          >
            <Text className="text-brand-terracotta text-xs font-sans-bold">
              {loggingOut ? '...' : 'Deslogar'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Tab switcher */}
      <View
        className="flex-row mx-4 mt-4 rounded-2xl overflow-hidden p-1 gap-1"
        style={{ backgroundColor: 'rgba(255,252,248,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {(['orders', 'drivers'] as Tab[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            className="flex-1 py-[10px] rounded-xl items-center active:opacity-80"
            style={{
              backgroundColor: tab === t ? '#003D1F' : 'transparent',
              borderWidth:     tab === t ? 1 : 0,
              borderColor:     tab === t ? 'rgba(197,160,89,0.35)' : 'transparent',
            }}
          >
            <Text
              className="text-[13px] font-sans-medium"
              style={{ color: tab === t ? colors.brand.gold : 'rgba(255,255,255,0.45)' }}
            >
              {t === 'orders' ? `Pedidos (${orders.length})` : `Motoristas (${drivers.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.brand.gold} size="large" />
        </View>
      ) : tab === 'drivers' ? (
        <FlatList
          data={drivers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DriverCard
              driver={item}
              onApprove={() => handleApprove(item.id)}
              onBlock={() => handleBlock(item.id)}
            />
          )}
          ListEmptyComponent={
            <View className="pt-24 items-center">
              <Text className="text-white/30 text-[15px] font-sans">
                Nenhum motorista cadastrado
              </Text>
            </View>
          }
        />
      ) : (
        <>
          {/* Status filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
          >
            {([
              { key: 'all',        label: 'Todos'      },
              { key: 'pending',    label: 'Aguardando' },
              { key: 'accepted',   label: 'Aceitos'    },
              { key: 'delivering', label: 'Em rota'    },
              { key: 'delivered',  label: 'Entregues'  },
            ] as { key: OrderFilter; label: string }[]).map((f) => {
              const count = f.key === 'all'
                ? orders.length
                : orders.filter((o) => o.status === f.key).length;
              const active = orderFilter === f.key;
              return (
                <Pressable
                  key={f.key}
                  onPress={() => setOrderFilter(f.key)}
                  className="rounded-xl px-3 py-[7px] active:opacity-70"
                  style={{
                    backgroundColor: active ? 'rgba(197,160,89,0.20)' : 'rgba(255,252,248,0.08)',
                    borderWidth: 1,
                    borderColor: active ? 'rgba(197,160,89,0.45)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <Text
                    className="text-[12px] font-sans-medium"
                    style={{ color: active ? colors.brand.gold : 'rgba(255,255,255,0.50)' }}
                  >
                    {f.label} ({count})
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <OrderCard
                order={item}
                drivers={drivers}
                onAssign={(driverId) => handleAssign(item.id, driverId)}
                onAdvance={() => handleAdvance(item)}
              />
            )}
            ListEmptyComponent={
              <View className="pt-24 items-center">
                <Text className="text-white/30 text-[15px] font-sans">
                  Nenhum pedido encontrado
                </Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
    </AppBackground>
  );
}
