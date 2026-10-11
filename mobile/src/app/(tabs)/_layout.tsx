import { Tabs } from 'expo-router';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useXCard } from '@/store/xcard-store';

export default function TabLayout() {
  const { theme } = useXCard();
  const { width } = useWindowDimensions();
  const isSmall = width < 360;
  const isDesktop = width >= 900;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.bronze,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: isSmall ? 56 : 64,
          paddingBottom: isSmall ? 6 : 10,
          paddingTop: 6,
          ...(isDesktop
            ? {
                maxWidth: 680,
                width: '100%',
                alignSelf: 'center',
                marginHorizontal: 'auto',
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderLeftColor: theme.border,
                borderRightColor: theme.border,
                borderRadius: 16,
                marginBottom: 10,
              }
            : {}),
        },
        tabBarLabelStyle: {
          fontSize: isSmall ? 9.5 : 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'house.fill', android: 'home', web: 'home' }}
              tintColor={color}
              size={isSmall ? 20 : 22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' }}
              tintColor={color}
              size={isSmall ? 20 : 22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'chart.bar.fill', android: 'insights', web: 'insights' }}
              tintColor={color}
              size={isSmall ? 20 : 22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: isSmall ? 'Activity' : 'Transactions',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'list.bullet', android: 'receipt', web: 'receipt' }}
              tintColor={color}
              size={isSmall ? 20 : 22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
              tintColor={color}
              size={isSmall ? 20 : 22}
            />
          ),
        }}
      />
    </Tabs>
  );
}