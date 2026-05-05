import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { CATALOG_PRODUCTS } from '@/data/products';
import type { Language, ProductCategory } from '@/shared/types';
import { useAppStore } from '@/shared/store/appStore';
import { useAuthStore } from '@/shared/store/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CategoryCard {
  category: ProductCategory;
  emoji: string;
  label: Record<Language, string>;
  sublabel: Record<Language, string>;
  color: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    category: 'salgado',
    emoji: '🥟',
    label:    { pt: 'Salgados',  en: 'Savory',  de: 'Herzhaft' },
    sublabel: { pt: 'Coxinha, Risole e mais', en: 'Coxinha, Risole & more', de: 'Herzhaftes & mehr' },
    color: '#004B5E',
  },
  {
    category: 'bolo',
    emoji: '🎂',
    label:    { pt: 'Bolos',   en: 'Cakes',  de: 'Kuchen'  },
    sublabel: { pt: 'Caseiros com cobertura', en: 'Homemade with frosting', de: 'Hausgemacht' },
    color: '#7A5C1E',
  },
  {
    category: 'doce',
    emoji: '🍫',
    label:    { pt: 'Doces',  en: 'Sweets', de: 'Süßes'   },
    sublabel: { pt: 'Brigadeiro, Beijinho', en: 'Brigadeiro, Beijinho', de: 'Brigadeiro & mehr' },
    color: '#6B3A2A',
  },
  {
    category: 'combo',
    emoji: '🎉',
    label:    { pt: 'Combos',  en: 'Combos', de: 'Combos'  },
    sublabel: { pt: 'Para festas e eventos', en: 'For parties & events', de: 'Für Events' },
    color: '#003322',
  },
];

const FEATURED = CATALOG_PRODUCTS.slice(0, 5);

export default function HomeScreen() {
  const { language } = useAppStore();
  const { user } = useAuthStore();
  const lang = language as Language;

  const firstName = user?.email?.split('@')[0] ?? 'bem-vindo';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {firstName} 👋</Text>
            <Text style={styles.headerTitle}>Petisco Brazil</Text>
          </View>
          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryBadgeText}>🇧🇷 Berlim</Text>
          </View>
        </View>

        {/* ── Hero banner ─────────────────────────────────────────── */}
        <View style={styles.heroBanner}>
          <LinearGradient
            colors={['#004B5E', '#003322']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBannerGradient}
          >
            <View style={styles.heroBannerLeft}>
              <Text style={styles.heroBannerEyebrow}>ENCOMENDA ESPECIAL</Text>
              <Text style={styles.heroBannerTitle}>
                Sabor do Brasil{'\n'}na sua mesa
              </Text>
              <View style={styles.heroBannerTagRow}>
                <View style={styles.heroBannerTag}>
                  <Text style={styles.heroBannerTagText}>🚚 Qua–Dom</Text>
                </View>
                <View style={styles.heroBannerTag}>
                  <Text style={styles.heroBannerTagText}>📦 Mín. 20 un.</Text>
                </View>
              </View>
            </View>
            <Text style={styles.heroBannerEmoji}>🥟</Text>
          </LinearGradient>
        </View>

        {/* ── Categories ──────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <Pressable onPress={() => router.push('/(tabs)/catalog')}>
              <Text style={styles.sectionLink}>Ver tudo →</Text>
            </Pressable>
          </View>

          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.category}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/catalog',
                    params: { category: cat.category },
                  })
                }
                style={[styles.categoryCard, { backgroundColor: cat.color }]}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={styles.categoryLabel}>{cat.label[lang]}</Text>
                <Text style={styles.categorySublabel} numberOfLines={1}>
                  {cat.sublabel[lang]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Featured products ───────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destaques</Text>
            <Pressable onPress={() => router.push('/(tabs)/catalog')}>
              <Text style={styles.sectionLink}>Ver cardápio →</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredRow}
          >
            {FEATURED.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </ScrollView>
        </View>

        {/* ── Info banner ─────────────────────────────────────────── */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerTitle}>Como funciona?</Text>
          {[
            { icon: '📅', text: 'Encomende com 3 dias de antecedência' },
            { icon: '🧊', text: 'Entregamos congelado ou fresquinho — você escolhe' },
            { icon: '📍', text: 'Entregas em Berlim e arredores' },
          ].map((item, i) => (
            <View key={i} style={styles.infoRow}>
              <Text style={styles.infoIcon}>{item.icon}</Text>
              <Text style={styles.infoText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003322' },
  scroll: { paddingBottom: 16 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  greeting: {
    color: 'rgba(197,160,89,0.85)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: -0.5,
  },
  deliveryBadge: {
    backgroundColor: 'rgba(197,160,89,0.12)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.2)',
    marginTop: 6,
  },
  deliveryBadgeText: {
    color: '#C5A059',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },

  // Hero
  heroBanner: {
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 28,
  },
  heroBannerGradient: {
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBannerLeft: { flex: 1 },
  heroBannerEyebrow: {
    color: '#C5A059',
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontFamily: 'Inter_500Medium',
    marginBottom: 8,
  },
  heroBannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'PlayfairDisplay_700Bold',
    lineHeight: 28,
    marginBottom: 14,
  },
  heroBannerTagRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  heroBannerTag: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBannerTagText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  heroBannerEmoji: { fontSize: 56, marginLeft: 16 },

  // Sections
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  sectionLink: {
    color: '#C5A059',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.12)',
    gap: 4,
  },
  categoryEmoji: { fontSize: 30, marginBottom: 6 },
  categoryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  categorySublabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },

  // Featured
  featuredRow: { paddingHorizontal: 16, gap: 12 },

  // Info banner
  infoBanner: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(197,160,89,0.06)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.18)',
    gap: 12,
  },
  infoBannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIcon: { fontSize: 18, lineHeight: 22 },
  infoText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 19,
    flex: 1,
  },
});
