import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
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
  const { user }     = useAuthStore();
  const lang         = language as Language;

  const firstName = user?.email?.split('@')[0] ?? 'bem-vindo';

  return (
    <SafeAreaView className="flex-1 bg-brand-green" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>

        {/* Header */}
        <View className="flex-row items-start justify-between px-5 pt-3 pb-5">
          <View>
            <Text className="text-brand-gold/[.85] text-[13px] font-sans mb-1">
              Olá, {firstName} 👋
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
            colors={['#004B5E', '#003322']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <View className="flex-1">
              <Text className="text-brand-gold text-[10px] tracking-[3px] uppercase font-sans-medium mb-2">
                ENCOMENDA ESPECIAL
              </Text>
              <Text className="text-white text-[22px] font-serif leading-7 mb-[14px]">
                Sabor do Brasil{'\n'}na sua mesa
              </Text>
              <View className="flex-row gap-2 flex-wrap">
                <View className="bg-white/[.12] rounded-[20px] px-[10px] py-[5px]">
                  <Text className="text-white/[.85] text-[11px] font-sans-medium">🚚 Qua–Dom</Text>
                </View>
                <View className="bg-white/[.12] rounded-[20px] px-[10px] py-[5px]">
                  <Text className="text-white/[.85] text-[11px] font-sans-medium">📦 Mín. 20 un.</Text>
                </View>
              </View>
            </View>
            <Text className="text-[56px] ml-4">🥟</Text>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between px-5 mb-[14px]">
            <Text className="text-white text-xl font-serif">Categorias</Text>
            <Pressable onPress={() => router.push('/(tabs)/catalog')}>
              <Text className="text-brand-gold text-[13px] font-sans-medium">Ver tudo →</Text>
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
                style={{ width: (SCREEN_WIDTH - 42) / 2, backgroundColor: cat.color }}
                className="rounded-[20px] p-[18px] border border-brand-gold/[.12] gap-1 active:opacity-80"
              >
                <Text className="text-[30px] mb-1.5">{cat.emoji}</Text>
                <Text className="text-white text-base font-sans-bold">{cat.label[lang]}</Text>
                <Text className="text-white/50 text-[11px] font-sans" numberOfLines={1}>
                  {cat.sublabel[lang]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Featured products */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between px-5 mb-[14px]">
            <Text className="text-white text-xl font-serif">Destaques</Text>
            <Pressable onPress={() => router.push('/(tabs)/catalog')}>
              <Text className="text-brand-gold text-[13px] font-sans-medium">Ver cardápio →</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {FEATURED.map((product) => (
              <ProductCard key={product.id} product={product} featured />
            ))}
          </ScrollView>
        </View>

        {/* Info banner */}
        <View className="mx-4 bg-brand-gold/[.06] rounded-[20px] p-5 border border-brand-gold/[.18] gap-3">
          <Text className="text-white text-base font-sans-bold mb-1">Como funciona?</Text>
          {[
            { icon: '📅', text: 'Encomende com 3 dias de antecedência' },
            { icon: '🧊', text: 'Entregamos congelado ou fresquinho — você escolhe' },
            { icon: '📍', text: 'Entregas em Berlim e arredores' },
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
    </SafeAreaView>
  );
}
