import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/shared/components/AppBackground';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Car, Bike, PersonStanding } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/shared/store/authStore';
import { becomeDriver } from '@/features/auth/services/userService';
import { colors } from '@/shared/constants/colors';
import type { AppUser } from '@/features/auth/services/userService';

type VehicleType = NonNullable<AppUser['vehicleType']>;

type VehicleOption = { type: VehicleType; labelKey: string };

const VEHICLES: VehicleOption[] = [
  { type: 'car',        labelKey: 'driverRegister.car' },
  { type: 'motorcycle', labelKey: 'driverRegister.motorcycle' },
  { type: 'bicycle',    labelKey: 'driverRegister.bicycle' },
];

function VehicleIcon({ type, color }: { type: VehicleType; color: string }) {
  if (type === 'car')        return <Car size={22} color={color} />;
  if (type === 'motorcycle') return <Bike size={22} color={color} />;
  return <PersonStanding size={22} color={color} />;
}

export default function DriverRegisterScreen() {
  const { t }    = useTranslation();
  const { user, setUser } = useAuthStore();

  const [vehicle,  setVehicle]  = useState<VehicleType | null>(null);
  const [plate,    setPlate]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [saving,   setSaving]   = useState(false);

  const handleSubmit = async () => {
    if (!vehicle) {
      Alert.alert('', t('driverRegister.error_vehicle'));
      return;
    }
    if (!user?.uid) return;

    setSaving(true);
    try {
      await becomeDriver(user.uid, vehicle, plate, phone);
      // Update auth store so navigation effect redirects to /auth/pending
      setUser({ ...user, role: 'driver', status: 'pending' });
    } catch {
      Alert.alert('Erro', t('driverRegister.error_generic'));
      setSaving(false);
    }
  };

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
        <Text className="text-white text-lg font-serif flex-1">{t('driverRegister.title')}</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Subtitle */}
          <Text className="text-white/50 text-[14px] font-sans leading-[20px]">
            {t('driverRegister.subtitle')}
          </Text>

          {/* Vehicle type */}
          <View>
            <Text className="text-white/40 text-[11px] font-sans-medium uppercase tracking-[1px] mb-3">
              {t('driverRegister.vehicleType')}
            </Text>
            <View className="flex-row gap-3">
              {VEHICLES.map(({ type, labelKey }) => {
                const active    = vehicle === type;
                const iconColor = active ? colors.brand.gold : 'rgba(255,255,255,0.35)';
                return (
                  <Pressable
                    key={type}
                    onPress={() => setVehicle(type)}
                    className="flex-1 items-center py-4 rounded-2xl gap-2"
                    style={{
                      backgroundColor: active ? '#003D1F' : 'rgba(255,252,248,0.12)',
                      borderWidth:     active ? 1.5 : 1,
                      borderColor:     active ? colors.brand.gold : 'rgba(255,255,255,0.10)',
                    }}
                  >
                    <VehicleIcon type={type} color={iconColor} />
                    <Text
                      className="text-[12px] font-sans-medium"
                      style={{ color: active ? colors.brand.gold : 'rgba(255,255,255,0.40)' }}
                    >
                      {t(labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Details */}
          <View>
            <Text className="text-white/40 text-[11px] font-sans-medium uppercase tracking-[1px] mb-3">
              Dados
            </Text>
            <View
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'rgba(255,252,248,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
            >
              {/* Phone */}
              <View
                className="px-4 pt-3 pb-3"
                style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' }}
              >
                <Text className="text-white/40 text-[11px] font-sans-medium mb-1">
                  {t('driverRegister.phone').toUpperCase()}
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  style={{ color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_400Regular' }}
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  placeholder="+49 176 000 0000"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Plate */}
              <View className="px-4 pt-3 pb-3">
                <Text className="text-white/40 text-[11px] font-sans-medium mb-1">
                  {t('driverRegister.plate').toUpperCase()}
                </Text>
                <TextInput
                  value={plate}
                  onChangeText={setPlate}
                  style={{ color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_400Regular' }}
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  placeholder="B-XX 0000"
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            disabled={saving}
            className={`bg-brand-terracotta rounded-2xl py-4 items-center ${saving ? 'opacity-60' : 'active:opacity-80'}`}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-[15px] font-sans-bold">
                {t('driverRegister.submit')}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </AppBackground>
  );
}
