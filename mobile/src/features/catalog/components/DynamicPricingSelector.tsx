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
import { useCartStore } from '@/shared/store/cartStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// LinearGradient does not support className — inline object required
const ABS_FILL = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

interface DynamicPricingSelectorProps {
  product: CatalogProduct | null;
  visible: boolean;
  onClose: () => void;
}

export function DynamicPricingSelector({ product, visible, onClose }: DynamicPricingSelectorProps) {
  const { t, i18n } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);

  const tiers = product ? PRICING_TIERS[product.pricingType] : [];
  const [selectedTier, setSelectedTier] = useState<PricingTier>(tiers[0]);

  useEffect(() => {
    if (tiers.length > 0) setSelectedTier(tiers[0]);
  }, [product]);

  if (!product) return null;

  const lang = i18n.language as 'pt' | 'en' | 'de';
  const name        = product.name[lang]        ?? product.name.pt;
  const description = product.description[lang] ?? product.description.pt;
  const isBolo      = product.pricingType === 'bolo';

  const handleAdd = () => {
    if (!selectedTier) return;
    addItem(product, selectedTier.qty, selectedTier.price);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/[.65] justify-end">
        <Pressable style={ABS_FILL} onPress={onClose} />

        <View
          className="bg-white rounded-t-[32px] overflow-hidden"
          style={{ maxHeight: SCREEN_HEIGHT * 0.88 }}
        >
          {/* Drag handle */}
          <View className="absolute top-[10px] self-center w-9 h-1 rounded-full bg-white/50 z-10" />

          {/* Hero image */}
          <View className="h-[220px] bg-[#C8B89A] overflow-hidden">
            <Image source={product.image} style={ABS_FILL} resizeMode="cover" />
            <LinearGradient
              colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.72)']}
              style={ABS_FILL}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <Pressable
              className="absolute top-[14px] right-4 w-[34px] h-[34px] rounded-full bg-black/40 items-center justify-center z-10"
              onPress={onClose}
              hitSlop={12}
            >
              <Text className="text-white text-sm font-sans-bold">✕</Text>
            </Pressable>
            <View className="absolute bottom-[18px] left-5 right-[60px]">
              <Text
                className="text-white text-2xl font-serif tracking-[-0.3px]"
                style={{
                  textShadowColor: 'rgba(0,0,0,0.4)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 4,
                }}
              >
                {name}
              </Text>
              <Text className="text-white/[.75] text-[13px] font-sans mt-1 leading-[18px]" numberOfLines={2}>
                {description}
              </Text>
            </View>
          </View>

          {/* Body */}
          <View className="pt-5 px-5">
            {isBolo ? (
              <View className="pb-2">
                <View className="flex-row items-center justify-between mb-[10px]">
                  <View>
                    <Text className="text-gray-400 text-[11px] font-sans-medium uppercase tracking-[0.5px] mb-1">
                      {t('product.unitPrice')}
                    </Text>
                    <Text className="text-brand-green text-[32px] font-serif tracking-[-0.5px]">
                      {formatEuro(2500)}
                    </Text>
                  </View>
                  <View className="bg-amber-100 rounded-[20px] px-3 py-1.5">
                    <Text className="text-amber-800 text-xs font-sans-bold">
                      {t('product.homeBaked')}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-400 text-xs font-sans leading-[17px]">
                  {t('product.boloNote')}
                </Text>
              </View>
            ) : (
              <>
                <View className="flex-row items-baseline justify-between mb-[14px]">
                  <Text className="text-[#1A1A1A] text-base font-sans-bold">
                    {t('product.quantity')}
                  </Text>
                  <Text className="text-gray-400 text-[11px] font-sans">
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
                        className={`w-[108px] rounded-2xl p-[14px] border-2 gap-[3px] ${
                          isSelected
                            ? 'bg-brand-green border-brand-green shadow-md'
                            : 'bg-[#F8F6F1] border-transparent'
                        }`}
                      >
                        {tier.bestValue && (
                          <View className="bg-brand-gold rounded-lg px-1.5 py-[3px] self-start mb-1.5">
                            <Text className="text-brand-green text-[9px] font-sans-bold">
                              {t('product.bestValue')}
                            </Text>
                          </View>
                        )}
                        <Text className={`text-[22px] font-serif tracking-[-0.5px] ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                          {tier.qty}
                          <Text className={`text-[13px] font-sans ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                            {' '}{t('product.unitAbbr')}
                          </Text>
                        </Text>
                        <Text className={`text-[15px] font-sans-bold ${isSelected ? 'text-brand-gold' : 'text-brand-green'}`}>
                          {formatEuro(tier.price)}
                        </Text>
                        <Text className={`text-[11px] font-sans ${isSelected ? 'text-white/50' : 'text-gray-400'}`}>
                          {formatEuro(unitCents)}/{t('product.unitAbbr')}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </>
            )}
          </View>

          {/* Footer CTA */}
          <View className="px-5 pt-4 pb-9 border-t border-gray-100 mt-5 gap-3">
            {!isBolo && selectedTier && (
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500 text-[13px] font-sans">
                  {t('product.unitsSelected', { count: selectedTier.qty })}
                </Text>
                <Text className="text-brand-green text-[22px] font-serif tracking-[-0.3px]">
                  {formatEuro(selectedTier.price)}
                </Text>
              </View>
            )}
            <Pressable
              className="bg-brand-terracotta rounded-2xl py-[17px] px-5 flex-row items-center justify-center gap-3 shadow-lg active:opacity-80"
              onPress={handleAdd}
            >
              <Text className="text-white text-base font-sans-bold tracking-[0.2px]">
                {t('product.addToCartFull')}
              </Text>
              {!isBolo && selectedTier && (
                <View className="bg-white/[.18] rounded-lg px-[10px] py-1">
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
