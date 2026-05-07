import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBackground } from '@/shared/components/AppBackground';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { DynamicPricingSelector } from '@/features/catalog/components/DynamicPricingSelector';
import { CATALOG_PRODUCTS } from '@/data/products';
import type { CatalogProduct, Language, ProductCategory } from '@/shared/types';
import { useAppStore } from '@/shared/store/appStore';
import { useAuthStore } from '@/shared/store/authStore';
import { useCartStore } from '@/shared/store/cartStore';

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

const STRINGS: Record<string, Record<Language, string>> = {
  greeting:     { pt: 'Olá',          en: 'Hello',       de: 'Hallo'         },
  heroEyebrow:  { pt: 'ENCOMENDA ESPECIAL', en: 'SPECIAL ORDER', de: 'SONDERBESTELLUNG' },
  heroTitle:    { pt: 'Sabor do Brasil\nna sua mesa', en: 'Brazilian flavors\nat your door', de: 'Brasilianischer\nGenuss bei dir' },
  heroBadge1:   { pt: '🚚 Qua–Dom',   en: '🚚 Wed–Sun',  de: '🚚 Mi–So'      },
  heroBadge2:   { pt: '📦 Mín. 20 un.', en: '📦 Min. 20 pc.', de: '📦 Mind. 20 St.' },
  categories:   { pt: 'Categorias',   en: 'Categories',  de: 'Kategorien'    },
  viewAll:      { pt: 'Ver tudo →',   en: 'View all →',  de: 'Alle →'        },
  featured:     { pt: 'Destaques',    en: 'Featured',    de: 'Highlights'    },
  viewMenu:     { pt: 'Ver cardápio →', en: 'View menu →', de: 'Menü →'      },
  howTitle:     { pt: 'Como funciona?', en: 'How it works?', de: 'Wie läuft\'s?' },
  how1:         { pt: 'Encomende com 3 dias de antecedência', en: 'Order 3 days in advance', de: 'Bestelle 3 Tage im Voraus' },
  how2:         { pt: 'Entregamos congelado ou fresquinho — você escolhe', en: 'Delivered frozen or fresh — your choice', de: 'Gefroren oder frisch geliefert — deine Wahl' },
  how3:         { pt: 'Entregas em Berlim e arredores', en: 'Deliveries in Berlin and surroundings', de: 'Lieferung in Berlin und Umgebung' },
};

export default function HomeScreen() {
  const { t }        = useTranslation();
  const { language } = useAppStore();
  const { user }     = useAuthStore();
  const addItem      = useCartStore((s) => s.addItem);
  const lang         = language as Language;
  const s            = (key: string) => STRINGS[key][lang];

  const firstName = user?.email?.split('@')[0] ?? 'bem-vindo';

  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [isSelectorOpen, setIsSelectorOpen]   = useState(false);
  const handleProductPress = useCallback((p: CatalogProduct) => {
    setSelectedProduct(p);
    setIsSelectorOpen(true);
  }, []);

  return (
    <AppBackground>
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>

        {/* Header */}
        <View className="flex-row items-start justify-between px-5 pt-3 pb-5">
          <View>
            <Text className="text-brand-gold/[.85] text-[13px] font-sans mb-1">
              {s('greeting')}, {firstName} 👋
            </Text>
            <Text className="text-white text-[26px] font-serif tracking-[-0.5px]">
              Petisco Brazil
            </Text>
          </View>
          <View className="bg-brand-gold/[.12] rounded-[20px] px-3 py-1.5 border border-brand-gold/20 mt-1.5">
            <Text className="text-brand-gold text-xs font-sans-medium">🇧🇷 Berlim</Text>
          </View>
        </View>

        {/* Hero banner */}
        <View className="mx-4 rounded-3xl overflow-hidden mb-7">
          <LinearGradient
            colors={['#C5A059', '#003322'] /* was: ['#004B5E', '#003322'] */}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <View className="flex-1">
              <Text className="text-brand-green text-[10px] tracking-[3px] uppercase font-sans-bold mb-4">
                {s('heroEyebrow')}
              </Text>
              <Text className="text-white text-[22px] font-serif leading-7 mb-[14px]">
                {s('heroTitle')}
              </Text>
              <View className="flex-row gap-2 flex-wrap">
                <View className="bg-white/[.12] rounded-[20px] px-[10px] py-[5px]">
                  <Text className="text-white/[.85] text-[11px] font-sans-medium">{s('heroBadge1')}</Text>
                </View>
                <View className="bg-white/[.12] rounded-[20px] px-[10px] py-[5px]">
                  <Text className="text-white/[.85] text-[11px] font-sans-medium">{s('heroBadge2')}</Text>
                </View>
              </View>
            </View>
            <Text className="text-[56px] ml-4">🥟</Text>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between px-5 mb-[14px]">
            <Text className="text-white text-xl font-serif">{s('categories')}</Text>
            <Pressable onPress={() => router.push('/(tabs)/catalog')}>
              <Text className="text-brand-gold text-[13px] font-sans-medium">{s('viewAll')}</Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap px-4 gap-[10px]">
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.category}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/catalog',
                    params: { category: cat.category },
                  })
                }
                style={{
                  width: (SCREEN_WIDTH - 42) / 2,
                  backgroundColor: 'rgba(255, 252, 248, 0.06)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.09)',
                }}
                className="rounded-[20px] p-[18px] gap-1 active:scale-[0.97] active:opacity-80"
              >
                <Text className="text-[28px] mb-1">{cat.emoji}</Text>
                <Text className="text-white text-[15px] font-sans-bold tracking-[-0.1px]">{cat.label[lang]}</Text>
                <Text className="text-white/45 text-[11px] font-sans" numberOfLines={1}>
                  {cat.sublabel[lang]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Featured products */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between px-5 mb-[14px]">
            <Text className="text-white text-xl font-serif">{s('featured')}</Text>
            <Pressable onPress={() => router.push('/(tabs)/catalog')}>
              <Text className="text-brand-gold text-[13px] font-sans-medium">{s('viewMenu')}</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {FEATURED.map((product) => (
              <ProductCard key={product.id} product={product} featured onPress={handleProductPress} />
            ))}
          </ScrollView>
        </View>

        {/* Info banner */}
        <View className="mx-4 bg-brand-gold/[.06] rounded-[20px] p-5 border border-brand-gold/[.18] gap-3">
          <Text className="text-white text-base font-sans-bold mb-1">{s('howTitle')}</Text>
          {[
            { icon: '📅', text: s('how1') },
            { icon: '🧊', text: s('how2') },
            { icon: '📍', text: s('how3') },
          ].map((item, i) => (
            <View key={i} className="flex-row items-start gap-3">
              <Text className="text-[18px] leading-[22px]">{item.icon}</Text>
              <Text className="text-white/[.65] text-[13px] font-sans leading-[19px] flex-1">
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>

      {isSelectorOpen && selectedProduct && (
        <DynamicPricingSelector
          product={selectedProduct}
          visible={true}
          onClose={() => setIsSelectorOpen(false)}
          onConfirm={({ product, quantity, price }) => {
            addItem(product, quantity, price);
            setIsSelectorOpen(false);
          }}
        />
      )}
    </SafeAreaView>
    </AppBackground>
  );
}
