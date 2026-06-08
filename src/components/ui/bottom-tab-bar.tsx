import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter, useSegments } from 'expo-router';
import {
  CalendarDays,
  Home,
  MessageCircle,
  Package,
  Plus,
  Search,
  User,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProviderActionSheet } from '@/components/wasla/provider-action-sheet';
import { Text } from './text';
import { rowDirection } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const TAB_BG = '#ffffff';

interface TabConfig {
  name: string;
  label: string;
  href: string;
  Icon: React.ComponentType<{ size: number; color: string; fill?: string; strokeWidth?: number }>;
  isAction?: boolean;
}

const CUSTOMER_TABS: TabConfig[] = [
  { name: 'index', label: 'tabs.home', href: '/(customer)/', Icon: Home },
  { name: 'search', label: 'tabs.search', href: '/(customer)/search', Icon: Search },
  { name: 'bookings', label: 'tabs.bookings', href: '/(customer)/bookings', Icon: CalendarDays },
  { name: 'chat', label: 'tabs.chat', href: '/(customer)/chat', Icon: MessageCircle },
  { name: 'profile', label: 'tabs.account', href: '/(customer)/profile', Icon: User },
];

const PROVIDER_TABS: TabConfig[] = [
  { name: 'index', label: 'tabs.dashboard', href: '/(provider)/', Icon: Home },
  { name: 'services', label: 'tabs.services', href: '/(provider)/services', Icon: Package },
  { name: 'add', label: 'tabs.add', href: '', Icon: Plus, isAction: true },
  { name: 'chat', label: 'tabs.chat', href: '/(provider)/chat', Icon: MessageCircle },
  { name: 'profile', label: 'tabs.account', href: '/(provider)/profile', Icon: User },
];

export function WaslaTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments() as string[];
  const [sheetVisible, setSheetVisible] = useState(false);

  const isProvider =
    segments.includes('(provider)') || state.routes.some((r) => r.name === 'services');
  const tabs = isProvider ? PROVIDER_TABS : CUSTOMER_TABS;

  // Active tab: prefer the navigator's current route name; for the home tab the
  // segment after the group is empty, so fall back to "index" when nothing is set.
  const activeRouteName = state.routes[state.index]?.name ?? 'index';

  return (
    <>
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {tabs.map((tab) => {
          if (tab.isAction) {
            return (
              <Pressable
                key="action-add"
                onPress={() => setSheetVisible(true)}
                style={styles.actionTab}
                accessibilityRole="button"
                accessibilityLabel={t(tab.label)}
              >
                <View style={styles.actionCircle}>
                  <Plus size={28} color="#fff" strokeWidth={2.5} />
                </View>
                <Text variant="caption" style={[styles.tabLabel, { color: MUTED }]}>
                  {t(tab.label)}
                </Text>
              </Pressable>
            );
          }

          const isFocused = activeRouteName === tab.name;
          const { Icon, label } = tab;

          const onPress = () => {
            if (isFocused) return;
            // Prefer the navigator's tabPress flow when the route is registered,
            // so the navigator's preserve-state behavior kicks in. Otherwise fall
            // back to router.push so hidden routes still navigate.
            const registered = state.routes.find((r) => r.name === tab.name);
            if (registered) {
              const event = navigation.emit({
                type: 'tabPress',
                target: registered.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) {
                navigation.navigate(registered.name);
              }
            } else {
              router.push(tab.href as any);
            }
          };

          return (
            <Pressable
              key={tab.name}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityLabel={t(label)}
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              <Icon
                size={24}
                color={isFocused ? PRIMARY : MUTED}
                fill={isFocused ? PRIMARY : 'none'}
                strokeWidth={isFocused ? 0 : 2}
              />
              <Text
                variant="caption"
                style={[styles.tabLabel, { color: isFocused ? PRIMARY : MUTED }]}
              >
                {t(label)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isProvider && (
        <ProviderActionSheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: rowDirection,
    backgroundColor: TAB_BG,
    borderTopWidth: 1,
    borderTopColor: 'hsl(198, 21%, 88%)',
    paddingTop: 10,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 48,
  },
  tabLabel: {
    fontWeight: '500',
    fontFamily: 'Rubik',
  },
  actionTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 48,
    marginTop: -12,
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
});
