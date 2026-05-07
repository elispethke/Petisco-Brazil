import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { CatalogProduct, PricingTier } from '@/shared/types';
import { PRICING_TIERS, formatEuro, getUnitPrice } from '../utils/pricing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// LinearGradient / absolute overlays cannot use className — inline objects required
const ABS_FILL  = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

const CTA_SHADOW = {
  shadowColor:   '#B35C37',
  shadowOffset:  { width: 0, height: 6 },
  shadowOpacity: 0.55,
  shadowRadius:  16,
  elevation:     12,
};

interface DynamicPricingSelectorProps {
  product:   CatalogProduct | null;
  visible:   boolean;
  onClose:   () => void;
  onConfirm: (args: { product: CatalogProduct; quantity: number; price: number }) => void;
}

export function DynamicPricingSelector({
  product,
  visible,
  onClose,
  onConfirm,
}: DynamicPricingSelectorProps) {
  const { t, i18n } = useTranslation();

  const tiers = product ? PRICING_TIERS[product.pricingType] : [];
  const [selectedTier, setSelectedTier] = useState<PricingTier>(tiers[0]);

  useEffect(() => {
    if (tiers.length > 0) setSelectedTier(tiers[0]);
  }, [product]);

  if (!product) return null;

  const lang        = i18n.language as 'pt' | 'en' | 'de';
  const name        = product.name[lang]        ?? product.name.pt;
  const description = product.description[lang] ?? product.description.pt;
  const isBolo      = product.pricingType === 'bolo';

  const handleAdd = () => {
    if (!selectedTier) return;
    onConfirm({ product, quantity: selectedTier.qty, price: selectedTier.price });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.72)' }}>
        {/* Backdrop tap to dismiss */}
        <Pressable style={ABS_FILL} onPress={onClose} />

        {/* Sheet */}
        <View
          className="rounded-t-[32px] overflow-hidden"
          style={{
            maxHeight:       SCREEN_HEIGHT * 0.9,
            backgroundColor: '#071F10',
            borderTopWidth:  1,
            borderTopColor:  'rgba(255,255,255,0.08)',
          }}
        >
          {/* Drag handle */}
          <View
            className="absolute top-[10px] self-center w-9 h-1 rounded-full z-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          />

          {/* ── Hero image ─────────────────────────────────────────── */}
          <View className="overflow-hidden" style={{ height: 220 }}>
            <Image source={product.image} style={ABS_FILL} resizeMode="cover" />

            {/* Top vignette */}
            <LinearGradient
              colors={['rgba(0,0,0,0.30)', 'transparent']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              pointerEvents="none"
            />

            {/* Bottom fade into sheet */}
            <LinearGradient
              colors={['transparent', 'rgba(7,31,16,0.55)', 'rgba(7,31,16,0.95)']}
              locations={[0, 0.55, 1.0]}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              pointerEvents="none"
            />

            {/* Close button */}
            <Pressable
              className="absolute top-[14px] right-4 w-[34px] h-[34px] rounded-full items-center justify-center z-10"
              style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
              onPress={onClose}
              hitSlop={12}
            >
              <Text className="text-white text-sm font-sans-bold">✕</Text>
            </Pressable>

            {/* Title block overlaid on image */}
            <View className="absolute bottom-[18px] left-5 right-[52px]">
              <Text className="text-white text-[20px] font-serif tracking-[-0.3px]">
                {name}
              </Text>
              <Text
                className="text-white/50 text-[13px] font-sans mt-[3px] leading-[18px]"
                numberOfLines={2}
              >
                {description}
              </Text>
            </View>
          </View>

          {/* ── Body ───────────────────────────────────────────────── */}
          <View className="pt-5 px-5">
            {isBolo ? (
              // Bolo: fixed price card
              <View
                className="rounded-2xl p-4 gap-[6px]"
                style={{
                  backgroundColor: 'rgba(255,252,248,0.12)',
                  borderWidth:     1,
                  borderColor:     'rgba(255,255,255,0.10)',
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-white/40 text-[10px] font-sans-medium uppercase tracking-[1px] mb-1">
                      {t('product.unitPrice')}
                    </Text>
                    <Text className="text-brand-gold text-[28px] font-serif tracking-[-0.5px]">
                      {formatEuro(selectedTier?.price ?? 2500)}
                    </Text>
                  </View>
                  <View
                    className="rounded-[20px] px-3 py-[6px]"
                    style={{ backgroundColor: 'rgba(197,160,89,0.15)', borderWidth: 1, borderColor: 'rgba(197,160,89,0.3)' }}
                  >
                    <Text className="text-brand-gold text-xs font-sans-bold">
                      {t('product.homeBaked')}
                    </Text>
                  </View>
                </View>
                <Text className="text-white/35 text-xs font-sans leading-[17px]">
                  {t('product.boloNote')}
                </Text>
              </View>
            ) : (
              // Tiers: horizontal scroll
              <>
                <View className="flex-row items-baseline justify-between mb-[14px]">
                  <Text className="text-white text-[15px] font-sans-bold">
                    {t('product.quantity')}
                  </Text>
                  <Text className="text-white/35 text-[11px] font-sans">
                    {t('product.minUnits')}
                  </Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20, gap: 10, paddingBottom: 4 }}
                >
                  {tiers.map((tier) => {
                    const isSelected = selectedTier?.qty === tier.qty;
                    const unitCents  = getUnitPrice(tier);
                    return (
                      <Pressable
                        key={tier.qty}
                        onPress={() => setSelectedTier(tier)}
                        style={isSelected
                          ? { backgroundColor: '#003D1F', borderWidth: 1.5, borderColor: '#C5A059' }
                          : { backgroundColor: 'rgba(255,252,248,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }
                        }
                        className="w-[108px] rounded-2xl p-[14px] gap-[3px]"
                      >
                        {tier.bestValue && (
                          <View className="bg-brand-gold rounded-md px-[6px] py-[3px] self-start mb-1">
                            <Text className="text-brand-green text-[9px] font-sans-bold">
                              {t('product.bestValue')}
                            </Text>
                          </View>
                        )}
                        <Text className={`text-[22px] font-serif tracking-[-0.5px] ${isSelected ? 'text-white' : 'text-white/80'}`}>
                          {tier.qty}
                          <Text className={`text-[13px] font-sans ${isSelected ? 'text-white/70' : 'text-white/40'}`}>
                            {' '}{t('product.unitAbbr')}
                          </Text>
                        </Text>
                        <Text className={`text-[15px] font-sans-bold ${isSelected ? 'text-brand-gold' : 'text-white/60'}`}>
                          {formatEuro(tier.price)}
                        </Text>
                        <Text className={`text-[11px] font-sans ${isSelected ? 'text-white/45' : 'text-white/30'}`}>
                          {formatEuro(unitCents)}/{t('product.unitAbbr')}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </>
            )}
          </View>

          {/* ── Footer CTA ─────────────────────────────────────────── */}
          <View
            className="px-5 pt-4 pb-9 mt-5 gap-3"
            style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' }}
          >
            {!isBolo && selectedTier && (
              <View className="flex-row items-center justify-between">
                <Text className="text-white/40 text-[13px] font-sans">
                  {t('product.unitsSelected', { count: selectedTier.qty })}
                </Text>
                <Text className="text-brand-gold text-[22px] font-serif tracking-[-0.4px]">
                  {formatEuro(selectedTier.price)}
                </Text>
              </View>
            )}

            <Pressable
              style={CTA_SHADOW}
              className="bg-brand-terracotta rounded-2xl py-[17px] px-5 flex-row items-center justify-center gap-3 active:opacity-80"
              onPress={handleAdd}
            >
              <Text className="text-white text-base font-sans-bold tracking-[0.2px]">
                {t('product.addToCartFull')}
              </Text>
              {!isBolo && selectedTier && (
                <View
                  className="rounded-lg px-[10px] py-1"
                  style={{ backgroundColor: 'rgba(255,255,255,0.16)' }}
                >
                  <Text className="text-white text-sm font-sans-bold">
                    {formatEuro(selectedTier.price)}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
