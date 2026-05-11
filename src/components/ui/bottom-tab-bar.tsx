import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, MessageCircle, Package, Plus, Search, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProviderActionSheet } from '@/components/wasla/provider-action-sheet';
import { Text } from './text';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const TAB_BG = '#ffffff';

interface TabConfig {
  name: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string; fill?: string; strokeWidth?: number }>;
  isAction?: boolean;
}

const CUSTOMER_TABS: TabConfig[] = [
  { name: 'index', label: 'الرئيسية', Icon: Home },
  { name: 'search', label: 'البحث', Icon: Search },
  { name: 'chat', label: 'المحادثات', Icon: MessageCircle },
  { name: 'profile', label: 'حسابي', Icon: User },
];

const PROVIDER_TABS: TabConfig[] = [
  { name: 'index', label: 'لوحتي', Icon: Home },
  { name: 'services', label: 'خدماتي', Icon: Package },
  { name: 'add', label: 'إضافة', Icon: Plus, isAction: true },
  { name: 'chat', label: 'المحادثات', Icon: MessageCircle },
  { name: 'profile', label: 'حسابي', Icon: User },
];

export function WaslaTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [sheetVisible, setSheetVisible] = useState(false);

  const isProvider = state.routes.some((r) => r.name === 'services');
  const tabs = isProvider ? PROVIDER_TABS : CUSTOMER_TABS;

  // Build a flat list that interleaves the action button for provider
  const routeTabs = isProvider
    ? (() => {
        // Provider real routes: index, services, chat, profile (add is phantom)
        const realRoutes = state.routes.filter((r) => r.name !== 'add');
        // Map PROVIDER_TABS order
        return PROVIDER_TABS.map((tab) => {
          if (tab.isAction) return { tab, route: null, index: -1 };
          const routeIdx = realRoutes.findIndex((r) => r.name === tab.name);
          return { tab, route: realRoutes[routeIdx] ?? null, index: routeIdx };
        });
      })()
    : tabs.map((tab, i) => ({ tab, route: state.routes[i] ?? null, index: i }));

  return (
    <>
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {routeTabs.map(({ tab, route, index }) => {
          if (tab.isAction) {
            return (
              <Pressable
                key="action-add"
                onPress={() => setSheetVisible(true)}
                style={styles.actionTab}
                accessibilityRole="button"
                accessibilityLabel="إضافة"
              >
                <View style={styles.actionCircle}>
                  <Plus size={28} color="#fff" strokeWidth={2.5} />
                </View>
                <Text variant="caption" style={[styles.tabLabel, { color: MUTED }]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          }

          if (!route) return null;

          const { options } = descriptors[route.key] ?? {};
          const isFocused = state.index === state.routes.indexOf(route);
          const { Icon, label } = tab;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityLabel={options?.tabBarAccessibilityLabel ?? label}
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
                {label}
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
    flexDirection: 'row-reverse',
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
