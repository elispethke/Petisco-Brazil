import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  Switch,
  Modal,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/shared/components/AppBackground';
import { MapPin, Navigation, X, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/shared/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import {
  subscribeToDriverOrders,
  subscribeToDriverDeliveryHistory,
  updateOrderStatus,
  completeDelivery,
} from '@/features/order/services/orderService';
import { uploadProofPhoto } from '@/features/order/services/storageService';
import { updateUserDoc, getUserDoc } from '@/features/auth/services/userService';
import { buildMapsUrl } from '@/features/order/utils/deliveryUtils';
import { formatEuro } from '@/features/catalog/utils/pricing';
import { colors } from '@/shared/constants/colors';
import type { FirestoreOrder, OrderStatus } from '@/shared/types';

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    colors.ui.gray500,
  accepted:   colors.brand.gold,
  delivering: colors.brand.petrol,
  delivered:  '#22c55e',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    'Aguardando',
  accepted:   'Pronto para retirada',
  delivering: 'Em rota',
  delivered:  'Entregue',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimestamp(ts: unknown): string {
  if (!ts) return '—';
  const t = ts as { toDate?: () => Date };
  if (typeof t.toDate === 'function') {
    return t.toDate().toLocaleDateString('pt-BR');
  }
  return '—';
}

// ─── History Card ─────────────────────────────────────────────────────────────

function HistoryCard({ order }: { order: FirestoreOrder }) {
  const summary       = order.items.map((i) => `${i.name} ×${i.quantity}`).join(' · ');
  const deliveredDate = order.deliveredAt
    ? formatTimestamp(order.deliveredAt)
    : (order.deliveryDate ?? '—');

  return (
    <View
      className="rounded-2xl p-4 gap-3"
      style={{
        backgroundColor: 'rgba(34,197,94,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(34,197,94,0.18)',
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="rounded-xl px-3 py-[5px]" style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}>
          <Text className="text-[11px] font-sans-bold uppercase tracking-[0.5px]" style={{ color: '#22c55e' }}>
            Entregue
          </Text>
        </View>
        <Text className="text-white/35 text-xs font-sans">{deliveredDate}</Text>
      </View>

      <Text className="text-white/70 text-[13px] font-sans leading-[18px]" numberOfLines={2}>
        {summary}
      </Text>

      {order.address && (
        <View className="flex-row items-center gap-1">
          <MapPin size={11} color={colors.brand.gold} />
          <Text className="text-white/45 text-xs font-sans flex-1" numberOfLines={1}>
            {order.address.street}
            {order.address.number ? `, ${order.address.number}` : ''} — {order.address.city}
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between">
        <Text className="text-white/40 text-xs font-sans">
          #{order.id.slice(0, 8).toUpperCase()}
        </Text>
        <Text className="text-brand-gold text-base font-serif">
          {formatEuro(order.total)}
        </Text>
      </View>

      {order.proofImageUrl ? (
        <Image
          source={{ uri: order.proofImageUrl }}
          style={{ width: '100%', height: 120, borderRadius: 12 }}
          resizeMode="cover"
        />
      ) : null}
    </View>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderDetailModal({
  order,
  userId,
  onClose,
  onDelivered,
}: {
  order:       FirestoreOrder;
  userId:      string;
  onClose:     () => void;
  onDelivered: () => void;
}) {
  const [initiating, setInitiating] = useState(false);
  const [photoUri,   setPhotoUri]   = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  const mapsUrl = buildMapsUrl(order);

  const { address } = order;
  const formattedAddress = address
    ? `${address.street}${address.number ? `, ${address.number}` : ''} — ${address.zipCode} ${address.city}`
    : null;

  const openMaps = async () => {
    if (!mapsUrl) return;
    const supported = await Linking.canOpenURL(mapsUrl);
    if (supported) await Linking.openURL(mapsUrl);
    else Alert.alert('', 'Não foi possível abrir o Google Maps.');
  };

  const handleInitDelivery = async () => {
    if (initiating) return;
    setInitiating(true);
    try {
      await updateOrderStatus(order.id, 'delivering');
      onClose();
    } catch {
      Alert.alert('Erro', 'Não foi possível iniciar a entrega.');
      setInitiating(false);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para registrar a entrega.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.65,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!photoUri || completing) return;
    setCompleting(true);
    try {
      const url = await uploadProofPhoto(order.id, photoUri);
      await completeDelivery(order.id, userId, url);
      onClose();
      onDelivered();
    } catch {
      Alert.alert('Erro', 'Não foi possível finalizar a entrega. Tente novamente.');
      setCompleting(false);
    }
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <SafeAreaView
          edges={['bottom']}
          style={{
            backgroundColor: '#071F10',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.08)',
            maxHeight: 600,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
            <Text className="text-white text-lg font-serif">
              {photoUri ? 'Confirmar Entrega' : 'Detalhes do Pedido'}
            </Text>
            <Pressable onPress={onClose} disabled={completing} className="active:opacity-70">
              <X size={20} color="rgba(255,255,255,0.5)" />
            </Pressable>
          </View>

          {photoUri ? (
            /* ── Photo confirmation step ──────────────────────── */
            <View className="px-5 pb-4 gap-4">
              <Text className="text-white/50 text-sm font-sans text-center">
                Verifique a foto antes de confirmar
              </Text>
              <Image
                source={{ uri: photoUri }}
                style={{ width: '100%', height: 240, borderRadius: 16 }}
                resizeMode="cover"
              />
              <Pressable
                className="rounded-xl py-[14px] items-center"
                style={{ backgroundColor: completing ? 'rgba(34,197,94,0.35)' : '#166534' }}
                onPress={handleConfirmDelivery}
                disabled={completing}
              >
                {completing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-white text-sm font-sans-bold">Confirmar entrega</Text>
                )}
              </Pressable>
              <Pressable
                className="items-center py-2 active:opacity-70"
                onPress={() => setPhotoUri(null)}
                disabled={completing}
              >
                <Text className="text-white/40 text-sm font-sans">Tirar outra foto</Text>
              </Pressable>
            </View>
          ) : (
            /* ── Detail view ──────────────────────────────────── */
            <>
              <ScrollView
                style={{ flexShrink: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8, gap: 14 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Status + ID */}
                <View className="flex-row items-center justify-between">
                  <View
                    className="rounded-xl px-3 py-[5px]"
                    style={{ backgroundColor: `${STATUS_COLORS[order.status]}22` }}
                  >
                    <Text
                      className="text-[11px] font-sans-bold uppercase tracking-[0.5px]"
                      style={{ color: STATUS_COLORS[order.status] }}
                    >
                      {STATUS_LABELS[order.status]}
                    </Text>
                  </View>
                  <Text className="text-white/35 text-xs font-sans">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Text>
                </View>

                {/* Address */}
                <View
                  className="rounded-2xl p-4 gap-2"
                  style={{ backgroundColor: 'rgba(0,75,94,0.20)', borderWidth: 1.5, borderColor: 'rgba(0,75,94,0.55)' }}
                >
                  <View className="flex-row items-center gap-2">
                    <MapPin size={14} color={colors.brand.gold} />
                    <Text className="text-white/50 text-[10px] font-sans-medium uppercase tracking-[0.5px]">
                      Endereço de entrega
                    </Text>
                  </View>
                  {formattedAddress ? (
                    <Text className="text-white text-[16px] font-sans-medium leading-[24px]">
                      {formattedAddress}
                    </Text>
                  ) : (
                    <Text className="text-white/30 text-[14px] font-sans">Endereço não informado</Text>
                  )}
                </View>

                {/* Delivery date */}
                {order.deliveryDate ? (
                  <View
                    className="rounded-xl p-3 gap-1"
                    style={{ backgroundColor: 'rgba(255,252,248,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <Text className="text-white/40 text-[10px] font-sans-medium uppercase tracking-[0.5px]">
                      Data de entrega
                    </Text>
                    <Text className="text-white text-[14px] font-sans">
                      {order.deliveryDate}
                      {order.deliveryTime ? ` · ${order.deliveryTime}` : ''}
                    </Text>
                  </View>
                ) : null}

                {/* Items */}
                <View
                  className="rounded-xl p-3 gap-2"
                  style={{ backgroundColor: 'rgba(255,252,248,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <Text className="text-white/40 text-[10px] font-sans-medium uppercase tracking-[0.5px]">
                    Itens
                  </Text>
                  {order.items.map((item, i) => (
                    <View key={i} className="flex-row items-center justify-between">
                      <Text className="text-white/80 text-[13px] font-sans flex-1" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-white/50 text-xs font-sans ml-2">×{item.quantity}</Text>
                    </View>
                  ))}
                  <View className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />
                  <View className="flex-row justify-between">
                    <Text className="text-white/40 text-xs font-sans">Total</Text>
                    <Text className="text-brand-gold text-[13px] font-serif">{formatEuro(order.total)}</Text>
                  </View>
                </View>
              </ScrollView>

              {/* Fixed CTAs */}
              <View
                className="px-5 pt-3 pb-2 gap-3"
                style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' }}
              >
                <Pressable
                  className={`flex-row items-center justify-center gap-2 rounded-xl py-[11px] ${!mapsUrl ? 'opacity-40' : 'active:opacity-80'}`}
                  style={{ backgroundColor: 'rgba(0,75,94,0.35)', borderWidth: 1, borderColor: 'rgba(0,75,94,0.6)' }}
                  onPress={openMaps}
                  disabled={!mapsUrl}
                >
                  <Navigation size={16} color="#FFFFFF" />
                  <Text className="text-white text-sm font-sans-bold">Abrir no Maps</Text>
                </Pressable>

                {order.status === 'accepted' && (
                  <Pressable
                    className="rounded-xl py-[14px] items-center"
                    style={{ backgroundColor: colors.brand.terracotta, opacity: initiating ? 0.65 : 1 }}
                    onPress={handleInitDelivery}
                    disabled={initiating}
                  >
                    {initiating ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text className="text-white text-sm font-sans-bold">Iniciar entrega</Text>
                    )}
                  </Pressable>
                )}

                {order.status === 'delivering' && (
                  <Pressable
                    className="rounded-xl py-[14px] items-center flex-row justify-center gap-2 active:opacity-80"
                    style={{ backgroundColor: '#166534' }}
                    onPress={handleTakePhoto}
                  >
                    <Camera size={16} color="#FFFFFF" />
                    <Text className="text-white text-sm font-sans-bold">Finalizar entrega</Text>
                  </Pressable>
                )}
              </View>
            </>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DeliveryScreen() {
  const { user }                        = useAuthStore();
  const { logout, loading: loggingOut } = useLogout();
  const [orders,        setOrders]      = useState<FirestoreOrder[]>([]);
  const [history,       setHistory]     = useState<FirestoreOrder[]>([]);
  const [loading,       setLoading]     = useState(true);
  const [isOnline,      setIsOnline]    = useState(false);
  const [toggling,      setToggling]    = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<FirestoreOrder | null>(null);
  const [activeTab,     setActiveTab]   = useState<'active' | 'history'>('active');

  // Persist online status — load from Firestore on mount
  useEffect(() => {
    if (!user?.uid) return;
    getUserDoc(user.uid).then((doc) => {
      if (doc) setIsOnline(doc.isOnline ?? false);
    });
  }, [user?.uid]);

  // Active orders (accepted + delivering)
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToDriverOrders(user.uid, (incoming) => {
      setOrders(incoming);
      setLoading(false);
    });
    return unsub;
  }, [user?.uid]);

  // Delivery history (delivered)
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToDriverDeliveryHistory(user.uid, setHistory);
    return unsub;
  }, [user?.uid]);

  const handleToggleOnline = async (value: boolean) => {
    if (!user?.uid || toggling) return;
    setToggling(true);
    try {
      await updateUserDoc(user.uid, { isOnline: value });
      setIsOnline(value);
    } finally {
      setToggling(false);
    }
  };

  const handleDelivered = () => {
    Alert.alert('Entrega Confirmada', 'Pedido entregue com sucesso. Obrigada pelo seu trabalho!');
  };

  const renderOrder = ({ item }: { item: FirestoreOrder }) => {
    const summary    = item.items.map((i) => `${i.name} ×${i.quantity}`).join(', ');
    const hasAddress = Boolean(item.address?.street);

    return (
      <Pressable
        onPress={() => setSelectedOrder(item)}
        className="rounded-2xl p-4 gap-3 active:opacity-80"
        style={{ backgroundColor: 'rgba(255,252,248,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
      >
        <View className="flex-row items-center justify-between">
          <View
            className="rounded-xl px-3 py-[5px]"
            style={{ backgroundColor: `${STATUS_COLORS[item.status]}22` }}
          >
            <Text
              className="text-[11px] font-sans-bold uppercase tracking-[0.5px]"
              style={{ color: STATUS_COLORS[item.status] }}
            >
              {STATUS_LABELS[item.status]}
            </Text>
          </View>
          <Text className="text-white/35 text-xs font-sans">
            #{item.id.slice(0, 8).toUpperCase()}
          </Text>
        </View>

        {item.deliveryDate ? (
          <Text className="text-white/60 text-[13px] font-sans">
            {item.deliveryDate}{item.deliveryTime ? ` · ${item.deliveryTime}` : ''}
          </Text>
        ) : null}

        <Text className="text-white/70 text-[13px] font-sans leading-[18px]" numberOfLines={1}>
          {summary}
        </Text>

        {hasAddress && (
          <View className="flex-row items-center gap-1">
            <MapPin size={11} color={colors.brand.gold} />
            <Text className="text-white/45 text-xs font-sans flex-1" numberOfLines={1}>
              {item.address!.street}
              {item.address!.number ? `, ${item.address!.number}` : ''} — {item.address!.city}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <Text className="text-white/40 text-xs font-sans">
            {item.items.reduce((n, i) => n + i.quantity, 0)} itens
          </Text>
          <Text className="text-brand-gold text-base font-serif">
            {formatEuro(item.total)}
          </Text>
        </View>
      </Pressable>
    );
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
          <Text className="text-white text-2xl font-serif mt-0.5">Minhas Entregas</Text>
        </View>
        <View className="items-end gap-2">
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: isOnline ? '#22c55e' : 'rgba(255,255,255,0.20)' }} />
            <Text className="text-white/50 text-xs font-sans">
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              disabled={toggling}
              trackColor={{ false: 'rgba(255,255,255,0.12)', true: `${colors.brand.gold}66` }}
              thumbColor={isOnline ? colors.brand.gold : 'rgba(255,255,255,0.4)'}
            />
          </View>
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

      {/* Tabs */}
      <View
        className="flex-row mx-4 mt-4 rounded-2xl overflow-hidden p-1 gap-1"
        style={{ backgroundColor: 'rgba(255,252,248,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {([
          { key: 'active',  label: `Ativas (${orders.length})` },
          { key: 'history', label: `Histórico (${history.length})` },
        ] as const).map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className="flex-1 py-[10px] rounded-xl items-center active:opacity-80"
            style={{
              backgroundColor: activeTab === tab.key ? '#003D1F' : 'transparent',
              borderWidth:     activeTab === tab.key ? 1 : 0,
              borderColor:     activeTab === tab.key ? 'rgba(197,160,89,0.35)' : 'transparent',
            }}
          >
            <Text
              className="text-[13px] font-sans-medium"
              style={{ color: activeTab === tab.key ? colors.brand.gold : 'rgba(255,255,255,0.45)' }}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.brand.gold} size="large" />
        </View>
      ) : activeTab === 'active' ? (
        orders.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-white/30 text-[15px] font-sans text-center">
              {isOnline
                ? 'Nenhuma entrega atribuída a você'
                : 'Fique Online para receber entregas'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderOrder}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        history.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-white/30 text-[15px] font-sans text-center">
              Nenhuma entrega concluída ainda
            </Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <HistoryCard order={item} />}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            showsVerticalScrollIndicator={false}
          />
        )
      )}

      {selectedOrder && user?.uid && (
        <OrderDetailModal
          order={selectedOrder}
          userId={user.uid}
          onClose={() => setSelectedOrder(null)}
          onDelivered={handleDelivered}
        />
      )}
    </SafeAreaView>
    </AppBackground>
  );
}
