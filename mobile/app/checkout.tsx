import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/shared/components/AppBackground';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { X, Calendar, Clock, MapPin } from 'lucide-react-native';
import { useCart } from '@/features/checkout/hooks/useCart';
import { formatDisplayDate } from '@/features/schedule/utils/dateValidation';
import { formatEuro } from '@/features/catalog/utils/pricing';
import { useAppStore } from '@/shared/store/appStore';
import { useAuthStore } from '@/shared/store/authStore';
import { createOrder } from '@/features/order/services/orderService';
import type { Language } from '@/shared/types';
import { colors } from '@/shared/constants/colors';

// Berlin center — placeholder until a geocoding API is integrated.
const MOCK_LAT = 52.52;
const MOCK_LNG = 13.405;

const INPUT_STYLE = {
  color: '#FFFFFF',
  fontSize: 14,
  fontFamily: 'Inter_400Regular',
  paddingVertical: 0,
} as const;

export default function CheckoutScreen() {
  const { t }        = useTranslation();
  const { language } = useAppStore();
  const { user }     = useAuthStore();
  const lang         = language as Language;

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

  // Address state — city and country default to Berlin/Deutschland for this market.
  const [street,  setStreet]  = useState('');
  const [number,  setNumber]  = useState('');
  const [city,    setCity]    = useState('Berlin');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('Deutschland');

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!user) return;
    if (!street.trim() || !zipCode.trim()) {
      Alert.alert('', t('checkout.addressRequired'));
      return;
    }
    setLoading(true);
    try {
      await createOrder(
        user.uid,
        items,
        selectedDate,
        selectedTime,
        {
          street:  street.trim(),
          number:  number.trim(),
          city:    city.trim(),
          zipCode: zipCode.trim(),
          country: country.trim(),
          lat:     MOCK_LAT,
          lng:     MOCK_LNG,
        },
      );
      clearCart();
      Alert.alert(
        '✅ Pedido Confirmado!',
        `Entrega: ${selectedDate} às ${selectedTime}`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }],
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível confirmar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
    <SafeAreaView className="flex-1 bg-transparent" edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-brand-gold/[.15]">
        <Text className="text-white text-xl font-serif">{t('checkout.title')}</Text>
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-brand-gold/10 items-center justify-center"
        >
          <X size={20} color={colors.brand.gold} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View className="m-4 mb-0 bg-brand-green-light rounded-2xl p-4 border border-brand-gold/[.15] gap-[10px]">
          <Text className="text-white text-[15px] font-sans-bold">{t('checkout.orderSummary')}</Text>
          {items.map((item, index) => (
            <View key={`${item.product.id}-${index}`} className="flex-row items-center gap-2">
              <Text className="flex-1 text-white/80 text-sm font-sans" numberOfLines={1}>
                {item.product.name[lang] ?? item.product.name.pt}
              </Text>
              <Text className="text-brand-gold text-[13px] font-sans-medium">{item.qty}un</Text>
              <Text className="text-white text-sm font-sans-bold min-w-[64px] text-right">
                {formatEuro(item.totalPrice)}
              </Text>
            </View>
          ))}
          <View className="h-px bg-brand-gold/20" />
          <View className="flex-row justify-between items-center">
            <Text className="text-white/70 text-[15px] font-sans">{t('cart.total')}</Text>
            <Text className="text-white text-xl font-serif">{formatEuro(totalPrice)}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View className="m-4 mb-0 bg-brand-green-light rounded-2xl p-4 border border-brand-gold/[.15] gap-[10px]">
          <View className="flex-row items-center gap-2">
            <MapPin size={18} color={colors.brand.gold} />
            <Text className="text-white text-[15px] font-sans-bold">{t('checkout.deliveryAddress')}</Text>
          </View>

          {/* Street + Number */}
          <View className="flex-row gap-2">
            <View
              className="flex-1 rounded-xl px-3 py-[10px]"
              style={{ backgroundColor: 'rgba(255,252,248,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
            >
              <Text className="text-white/40 text-[10px] font-sans-medium mb-1">{t('checkout.street').toUpperCase()}</Text>
              <TextInput
                value={street}
                onChangeText={setStreet}
                style={INPUT_STYLE}
                placeholderTextColor="rgba(255,255,255,0.25)"
                placeholder="Musterstraße"
              />
            </View>
            <View
              className="w-20 rounded-xl px-3 py-[10px]"
              style={{ backgroundColor: 'rgba(255,252,248,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
            >
              <Text className="text-white/40 text-[10px] font-sans-medium mb-1">{t('checkout.number').toUpperCase()}</Text>
              <TextInput
                value={number}
                onChangeText={setNumber}
                style={INPUT_STYLE}
                placeholderTextColor="rgba(255,255,255,0.25)"
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Zip + City */}
          <View className="flex-row gap-2">
            <View
              className="w-28 rounded-xl px-3 py-[10px]"
              style={{ backgroundColor: 'rgba(255,252,248,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
            >
              <Text className="text-white/40 text-[10px] font-sans-medium mb-1">{t('checkout.zipCode').toUpperCase()}</Text>
              <TextInput
                value={zipCode}
                onChangeText={setZipCode}
                style={INPUT_STYLE}
                placeholderTextColor="rgba(255,255,255,0.25)"
                placeholder="10115"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View
              className="flex-1 rounded-xl px-3 py-[10px]"
              style={{ backgroundColor: 'rgba(255,252,248,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
            >
              <Text className="text-white/40 text-[10px] font-sans-medium mb-1">{t('checkout.city').toUpperCase()}</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                style={INPUT_STYLE}
                placeholderTextColor="rgba(255,255,255,0.25)"
                placeholder="Berlin"
              />
            </View>
          </View>
        </View>

        {/* Date */}
        <View className="m-4 mb-0 bg-brand-green-light rounded-2xl p-4 border border-brand-gold/[.15] gap-[10px]">
          <View className="flex-row items-center gap-2">
            <Calendar size={18} color={colors.brand.gold} />
            <Text className="text-white text-[15px] font-sans-bold">{t('checkout.selectDate')}</Text>
          </View>
          <Text className="text-white/50 text-xs font-sans">{t('checkout.deliveryInfo')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
          >
            {availableDates.map((date) => {
              const val        = date.toISOString().split('T')[0];
              const isSelected = val === selectedDate;
              return (
                <Pressable
                  key={val}
                  onPress={() => setSelectedDate(val)}
                  className={`px-[14px] py-2 rounded-[20px] border ${
                    isSelected ? 'bg-brand-gold border-brand-gold' : 'border-brand-gold/30'
                  }`}
                >
                  <Text className={`text-xs font-sans ${isSelected ? 'text-brand-green font-sans-bold' : 'text-white/70'}`}>
                    {formatDisplayDate(date)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Time */}
        <View className="m-4 mb-0 bg-brand-green-light rounded-2xl p-4 border border-brand-gold/[.15] gap-[10px]">
          <View className="flex-row items-center gap-2">
            <Clock size={18} color={colors.brand.gold} />
            <Text className="text-white text-[15px] font-sans-bold">{t('checkout.selectTime')}</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {timeSlots.map((slot) => {
              const isSelected = slot.value === selectedTime;
              return (
                <Pressable
                  key={slot.value}
                  onPress={() => setSelectedTime(slot.value)}
                  className={`px-[14px] py-[10px] rounded-xl border min-w-[45%] items-center ${
                    isSelected ? 'bg-brand-terracotta border-brand-terracotta' : 'border-brand-gold/30'
                  }`}
                >
                  <Text className={`text-[13px] font-sans ${isSelected ? 'text-white font-sans-bold' : 'text-white/70'}`}>
                    {slot.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="h-[120px]" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-5 pb-9 border-t border-brand-gold/[.15]" style={{ backgroundColor: 'rgba(0,22,12,0.97)' }}>
        <Pressable
          onPress={handleConfirm}
          disabled={loading}
          className={`bg-brand-terracotta rounded-2xl py-4 items-center ${loading ? 'opacity-60' : 'active:opacity-80'}`}
        >
          <Text className="text-white text-[17px] font-sans-bold">
            {loading ? 'Processando...' : t('checkout.confirm')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
    </AppBackground>
  );
}
