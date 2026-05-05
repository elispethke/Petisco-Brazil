import React, { useState } from 'react';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { CatalogProduct } from '@/shared/types';
import { getStartingPrice, formatEuro } from '../utils/pricing';
import { DynamicPricingSelector } from './DynamicPricingSelector';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

// LinearGradient does not support className — inline object required
const ABS_FILL = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

const CATEGORY_COLORS: Record<string, string> = {
  salgado: '#004B5E',
  doce:    '#6B3A2A',
  combo:   '#003322',
  bolo:    '#7A5C1E',
};

interface ProductCardProps {
  product: CatalogProduct;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const [selectorOpen, setSelectorOpen] = useState(false);

  const lang = i18n.language as 'pt' | 'en' | 'de';
  const name        = product.name[lang]        ?? product.name.pt;
  const description = product.description[lang] ?? product.description.pt;

  const categoryLabel = t(`product.badge.${product.category}`, { defaultValue: product.category });
  const categoryColor = CATEGORY_COLORS[product.category] ?? '#003322';
  const isBolo        = product.pricingType === 'bolo';
  const startingPrice = getStartingPrice(product.pricingType);

  const cardWidth   = featured ? SCREEN_WIDTH * 0.72 : CARD_WIDTH;
  const imageHeight = featured ? 180 : 140;

  return (
    <>
      <Pressable
        style={{ width: cardWidth }}
        className="bg-white rounded-[20px] overflow-hidden shadow-md active:opacity-90"
        onPress={() => setSelectorOpen(true)}
        android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
      >
        <View style={{ height: imageHeight }} className="w-full bg-[#C8B89A] overflow-hidden">
          <Image source={product.image} style={ABS_FILL} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.38)']}
            style={ABS_FILL}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 0, y: 1 }}
          />
          <View
            className="absolute top-[10px] left-[10px] rounded-[20px] px-[10px] py-1"
            style={{ backgroundColor: categoryColor }}
          >
            <Text className="text-white text-[10px] font-sans-bold uppercase tracking-[0.6px]">
              {categoryLabel}
            </Text>
          </View>
        </View>

        <View className="p-[13px] gap-1.5">
          <Text className="text-[#1A1A1A] text-sm font-sans-bold tracking-[-0.1px]" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-gray-400 text-[11px] font-sans leading-[15px]" numberOfLines={1}>
            {description}
          </Text>
          <View className="flex-row items-center justify-between mt-1">
            <View>
              {!isBolo && (
                <Text className="text-gray-400 text-[9px] font-sans lowercase">
                  {t('product.fromLabel')}
                </Text>
              )}
              <Text className="text-brand-green text-[17px] font-serif tracking-[-0.3px]">
                {formatEuro(startingPrice)}
              </Text>
            </View>
            <View className="bg-brand-terracotta rounded-[10px] px-[14px] py-2 shadow-sm">
              <Text className="text-white text-xs font-sans-bold">
                {isBolo ? t('product.orderBolo') : t('product.choose')}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      <DynamicPricingSelector
        product={product}
        visible={selectorOpen}
        onClose={() => setSelectorOpen(false)}
      />
    </>
  );
}
