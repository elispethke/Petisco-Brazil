import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { CatalogProduct } from '@/shared/types';
import { getStartingPrice, formatEuro } from '../utils/pricing';
import { DynamicPricingSelector } from './DynamicPricingSelector';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

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
        style={[styles.card, { width: cardWidth }]}
        onPress={() => setSelectorOpen(true)}
        android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
      >
        {/* Image with gradient */}
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image
            source={product.image}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.38)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 0, y: 1 }}
          />
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryText}>{categoryLabel}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.description} numberOfLines={1}>{description}</Text>

          <View style={styles.footer}>
            <View>
              {!isBolo && (
                <Text style={styles.fromLabel}>{t('product.fromLabel')}</Text>
              )}
              <Text style={styles.price}>{formatEuro(startingPrice)}</Text>
            </View>
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#C8B89A',
    overflow: 'hidden',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  content: {
    padding: 13,
    gap: 6,
  },
  name: {
    color: '#1A1A1A',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  description: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  fromLabel: {
    color: '#9CA3AF',
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    textTransform: 'lowercase',
  },
  price: {
    color: '#003322',
    fontSize: 17,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: -0.3,
  },
  addButton: {
    backgroundColor: '#B35C37',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#B35C37',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
});
