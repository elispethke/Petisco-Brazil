import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react-native';
import { useCartStore } from '@/shared/store/cartStore';
import { View, Text } from 'react-native';
import { colors } from '@/shared/constants/colors';

function CartBadge() {
  const count = useCartStore((s) => s.totalItems());
  if (count === 0) return null;
  return (
    <View className="absolute -top-1 -right-2 bg-brand-terracotta rounded-[9px] min-w-[18px] h-[18px] items-center justify-center px-1">
      <Text className="text-white text-[10px] font-sans-bold">{count > 9 ? '9+' : count}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(0,24,12,0.92)',
          borderTopColor: 'rgba(197,160,89,0.25)',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor:   colors.brand.gold,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: t('tabs.catalog'),
          tabBarIcon: ({ color }) => <ShoppingBag size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('tabs.cart'),
          tabBarIcon: ({ color }) => (
            <View>
              <ShoppingCart size={22} color={color} />
              <CartBadge />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
