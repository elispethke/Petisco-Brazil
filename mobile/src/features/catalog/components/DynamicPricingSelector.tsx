import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { CatalogProduct, PricingTier } from '@/shared/types';
import { PRICING_TIERS, formatEuro, getUnitPrice } from '../utils/pricing';
import { useCartStore } from '@/shared/store/cartStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DynamicPricingSelectorProps {
  product: CatalogProduct | null;
  visible: boolean;
  onClose: () => void;
}

export function DynamicPricingSelector({
  product,
  visible,
  onClose,
}: DynamicPricingSelectorProps) {
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
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Hero image */}
          <View style={styles.heroContainer}>
            <Image
              source={product.image}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.72)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{name}</Text>
              <Text style={styles.heroDesc} numberOfLines={2}>{description}</Text>
            </View>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {isBolo ? (
              <View style={styles.boloSection}>
                <View style={styles.boloPriceRow}>
                  <View>
                    <Text style={styles.boloLabel}>{t('product.unitPrice')}</Text>
                    <Text style={styles.boloPrice}>{formatEuro(2500)}</Text>
                  </View>
                  <View style={styles.boloBadge}>
                    <Text style={styles.boloBadgeText}>{t('product.homeBaked')}</Text>
                  </View>
                </View>
                <Text style={styles.boloNote}>{t('product.boloNote')}</Text>
              </View>
            ) : (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('product.quantity')}</Text>
                  <Text style={styles.sectionHint}>{t('product.minUnits')}</Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tiersRow}
                >
                  {tiers.map((tier) => {
                    const isSelected = selectedTier?.qty === tier.qty;
                    const unitCents  = getUnitPrice(tier);
                    return (
                      <Pressable
                        key={tier.qty}
                        onPress={() => setSelectedTier(tier)}
                        style={[styles.tierCard, isSelected && styles.tierCardSelected]}
                      >
                        {tier.bestValue && (
                          <View style={styles.bestBadge}>
                            <Text style={styles.bestBadgeText}>{t('product.bestValue')}</Text>
                          </View>
                        )}
                        <Text style={[styles.tierQty, isSelected && styles.tierQtySelected]}>
                          {tier.qty}
                          <Text style={styles.tierQtyUnit}> {t('product.unitAbbr')}</Text>
                        </Text>
                        <Text style={[styles.tierPrice, isSelected && styles.tierPriceSelected]}>
                          {formatEuro(tier.price)}
                        </Text>
                        <Text style={[styles.tierUnitPrice, isSelected && styles.tierUnitPriceSelected]}>
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
          <View style={styles.footer}>
            {!isBolo && selectedTier && (
              <View style={styles.summary}>
                <Text style={styles.summaryLabel}>
                  {t('product.unitsSelected', { count: selectedTier.qty })}
                </Text>
                <Text style={styles.summaryPrice}>
                  {formatEuro(selectedTier.price)}
                </Text>
              </View>
            )}
            <Pressable style={styles.ctaBtn} onPress={handleAdd}>
              <Text style={styles.ctaText}>{t('product.addToCartFull')}</Text>
              {!isBolo && selectedTier && (
                <View style={styles.ctaPriceBadge}>
                  <Text style={styles.ctaPriceText}>{formatEuro(selectedTier.price)}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  handle: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    zIndex: 10,
  },
  heroContainer: {
    height: 220,
    backgroundColor: '#C8B89A',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  heroInfo: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    right: 60,
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
    lineHeight: 18,
  },
  body: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  boloSection:  { paddingBottom: 8 },
  boloPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  boloLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  boloPrice: {
    color: '#003322',
    fontSize: 32,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: -0.5,
  },
  boloBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  boloBadgeText: {
    color: '#92400E',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  boloNote: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#1A1A1A',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  sectionHint: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  tiersRow: {
    paddingRight: 20,
    gap: 10,
    paddingBottom: 4,
  },
  tierCard: {
    width: 108,
    backgroundColor: '#F8F6F1',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 3,
  },
  tierCardSelected: {
    backgroundColor: '#003322',
    borderColor: '#003322',
    shadowColor: '#003322',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  bestBadge: {
    backgroundColor: '#C5A059',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  bestBadgeText: {
    color: '#003322',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
  tierQty: {
    color: '#1A1A1A',
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: -0.5,
  },
  tierQtyUnit:          { fontSize: 13, fontFamily: 'Inter_400Regular' },
  tierQtySelected:      { color: '#FFFFFF' },
  tierPrice: {
    color: '#003322',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  tierPriceSelected:    { color: '#C5A059' },
  tierUnitPrice: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  tierUnitPriceSelected: { color: 'rgba(255,255,255,0.5)' },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 20,
    gap: 12,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  summaryPrice: {
    color: '#003322',
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: -0.3,
  },
  ctaBtn: {
    backgroundColor: '#B35C37',
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#B35C37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.2,
  },
  ctaPriceBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ctaPriceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
