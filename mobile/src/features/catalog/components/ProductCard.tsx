import React from 'react';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { CatalogProduct } from '@/shared/types';
import { getStartingPrice, formatEuro } from '../utils/pricing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH       = (SCREEN_WIDTH - 48) / 2;
const COMPACT_WIDTH    = 138;
const IMAGE_HEIGHT_FW  = Math.round((SCREEN_WIDTH - 32) * 0.56);

// LinearGradient / absolute positioning cannot use className — inline objects required
const ABS_FILL = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.30,
  shadowRadius: 24,
  elevation: 12,
};

const PLUS_SHADOW = {
  shadowColor: '#B35C37',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.55,
  shadowRadius: 10,
  elevation: 8,
};

const GLASS_SURFACE = {
  backgroundColor: 'rgba(255, 252, 248, 0.07)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.10)',
};

interface ProductCardProps {
  product: CatalogProduct;
  featured?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  onPress?: (product: CatalogProduct) => void;
}

export function ProductCard({
  product,
  featured  = false,
  compact   = false,
  fullWidth = false,
  onPress,
}: ProductCardProps) {
  const { t, i18n } = useTranslation();

  const lang = i18n.language as 'pt' | 'en' | 'de';
  const name        = product.name[lang]        ?? product.name.pt;
  const description = product.description[lang] ?? product.description.pt;

  const isBolo        = product.pricingType === 'bolo';
  const startingPrice = getStartingPrice(product.pricingType);

  const cardWidth   = compact ? COMPACT_WIDTH : featured ? SCREEN_WIDTH * 0.72 : CARD_WIDTH;
  const imageHeight = fullWidth ? IMAGE_HEIGHT_FW : compact ? 108 : featured ? 180 : CARD_WIDTH;

  return (
    <Pressable
      style={fullWidth
        ? [CARD_SHADOW, GLASS_SURFACE]
        : [{ width: cardWidth }, CARD_SHADOW, GLASS_SURFACE]}
      className={`rounded-[20px] active:scale-[0.97] active:opacity-[0.85]${fullWidth ? ' w-full' : ''}`}
      onPress={() => onPress?.(product)}
      android_ripple={{ color: 'rgba(255,255,255,0.06)' }}
    >
      {/* ── Image ──────────────────────────────────────────────── */}
      <View style={{ height: imageHeight }} className="w-full rounded-t-[20px] bg-[#1A1A14] overflow-hidden">
        <Image
          source={product.image}
          style={{ width: '100%', height: '100%', transform: [{ scale: 1.08 }] }}
          resizeMode="cover"
        />

        {/* Top vignette: studio-light framing */}
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.20)', 'transparent']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: imageHeight * 0.45 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          pointerEvents="none"
        />

        {/* Bottom gradient: gentle fade into card body */}
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(4, 20, 12, 0.55)']}
          locations={[0, 0.62, 1.0]}
          style={ABS_FILL}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Glass category badge */}
        {!compact && (
          <View
            className="absolute top-[10px] left-[10px] rounded-md px-[8px] py-[3px]"
            style={{ backgroundColor: 'rgba(0,0,0,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' }}
          >
            <Text className="text-white/75 text-[9px] font-sans-medium uppercase tracking-[1px]">
              {t(`product.badge.${product.category}`, { defaultValue: product.category })}
            </Text>
          </View>
        )}
      </View>

      {/* ── Floating + action ──────────────────────────────────── */}
      <View
        className="absolute right-3 w-[34px] h-[34px] rounded-full bg-brand-gold items-center justify-center"
        style={[{ top: imageHeight - 17 }, PLUS_SHADOW]}
      >
        <Text className="text-white text-[20px] font-sans-bold leading-none">+</Text>
      </View>

      {/* ── Inner highlight ────────────────────────────────────── */}
      <LinearGradient
        colors={['rgba(255,255,255,0.055)', 'transparent']}
        style={{ position: 'absolute', top: imageHeight, left: 0, right: 0, height: 48, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />

      {/* ── Card body ──────────────────────────────────────────── */}
      <View
        className={`pt-[22px] gap-[6px] ${
          fullWidth ? 'px-[16px] pb-[18px]' : 'px-[13px] pb-[14px]'
        }`}
      >
        <Text
          className={`text-white font-sans-bold tracking-[-0.2px] ${
            fullWidth ? 'text-[16px]' : compact ? 'text-[12px]' : 'text-[14px]'
          }`}
          numberOfLines={compact ? 2 : 1}
        >
          {name}
        </Text>

        {!compact && (
          <Text
            className={`text-white/40 font-sans leading-[16px] ${fullWidth ? 'text-[12px]' : 'text-[11px]'}`}
            numberOfLines={fullWidth ? 2 : 1}
          >
            {description}
          </Text>
        )}

        <View className="mt-[2px]">
          {!isBolo && !compact && (
            <Text className="text-white/25 text-[9px] font-sans lowercase">
              {t('product.fromLabel')}
            </Text>
          )}
          <Text
            className={`text-brand-gold font-serif tracking-[-0.4px] ${
              fullWidth ? 'text-[22px]' : compact ? 'text-[15px]' : 'text-[19px]'
            }`}
          >
            {formatEuro(startingPrice)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
