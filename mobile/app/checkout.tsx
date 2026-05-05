import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { X, Calendar, Clock } from 'lucide-react-native';
import { useCart } from '@/features/checkout/hooks/useCart';
import { formatDisplayDate } from '@/features/schedule/utils/dateValidation';
import { formatEuro } from '@/features/catalog/utils/pricing';
import { useAppStore } from '@/shared/store/appStore';
import type { Language } from '@/shared/types';
import { colors } from '@/shared/constants/colors';

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const lang = language as Language;

  const {
    items,
    totalPrice,
    availableDates,
    timeSlots,
    selectedDate,
    selectedTime,
    setSelectedDate,
    setSelectedTime,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearCart();
      Alert.alert(
        '✅ Pedido Confirmado!',
        `Entrega: ${selectedDate} às ${selectedTime}`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }],
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('checkout.title')}</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={colors.brand.gold} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('checkout.orderSummary')}</Text>
          {items.map((item, index) => (
            <View key={`${item.product.id}-${index}`} style={styles.orderRow}>
              <Text style={styles.orderName} numberOfLines={1}>
                {item.product.name[lang] ?? item.product.name.pt}
              </Text>
              <Text style={styles.orderQty}>{item.qty}un</Text>
              <Text style={styles.orderPrice}>{formatEuro(item.totalPrice)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t('cart.total')}</Text>
            <Text style={styles.totalValue}>{formatEuro(totalPrice)}</Text>
          </View>
        </View>

        {/* Date */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Calendar size={18} color={colors.brand.gold} />
            <Text style={styles.cardTitle}>{t('checkout.selectDate')}</Text>
          </View>
          <Text style={styles.infoText}>{t('checkout.deliveryInfo')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateRow}
          >
            {availableDates.map((date) => {
              const val = date.toISOString().split('T')[0];
              const isSelected = val === selectedDate;
              return (
                <Pressable
                  key={val}
                  onPress={() => setSelectedDate(val)}
                  style={[styles.dateChip, isSelected && styles.chipActive]}
                >
                  <Text style={[styles.dateText, isSelected && styles.chipActiveText]}>
                    {formatDisplayDate(date)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Time */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Clock size={18} color={colors.brand.gold} />
            <Text style={styles.cardTitle}>{t('checkout.selectTime')}</Text>
          </View>
          <View style={styles.timeGrid}>
            {timeSlots.map((slot) => {
              const isSelected = slot.value === selectedTime;
              return (
                <Pressable
                  key={slot.value}
                  onPress={() => setSelectedTime(slot.value)}
                  style={[styles.timeChip, isSelected && styles.timeChipActive]}
                >
                  <Text style={[styles.timeText, isSelected && styles.chipActiveText]}>
                    {slot.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleConfirm}
          style={[styles.confirmBtn, loading && styles.btnDisabled]}
          disabled={loading}
        >
          <Text style={styles.confirmBtnText}>
            {loading ? 'Processando...' : t('checkout.confirm')}
          </Text>
        </Pressable>
      </View>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197,160,89,0.15)',
  },
  title: { color: '#FFF', fontSize: 20, fontFamily: 'PlayfairDisplay_700Bold' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(197,160,89,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: colors.brand.greenLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.15)',
    gap: 10,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { color: '#FFF', fontSize: 15, fontFamily: 'Inter_700Bold' },
  infoText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderName: {
    flex: 1,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  orderQty: {
    color: colors.brand.gold,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  orderPrice: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    minWidth: 64,
    textAlign: 'right',
  },
  divider: { height: 1, backgroundColor: 'rgba(197,160,89,0.2)' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  totalValue: { color: '#FFF', fontSize: 20, fontFamily: 'PlayfairDisplay_700Bold' },
  dateRow: { gap: 8, paddingVertical: 4 },
  dateChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.3)',
  },
  chipActive: {
    backgroundColor: colors.brand.gold,
    borderColor: colors.brand.gold,
  },
  dateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  chipActiveText: { color: colors.brand.green, fontFamily: 'Inter_700Bold' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.3)',
    minWidth: '45%',
    alignItems: 'center',
  },
  timeChipActive: {
    backgroundColor: colors.brand.terracotta,
    borderColor: colors.brand.terracotta,
  },
  timeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: colors.brand.green,
    borderTopWidth: 1,
    borderTopColor: 'rgba(197,160,89,0.15)',
  },
  confirmBtn: {
    backgroundColor: colors.brand.terracotta,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  confirmBtnText: { color: '#FFF', fontSize: 17, fontFamily: 'Inter_700Bold' },
});
