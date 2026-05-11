import { Tabs } from 'expo-router';
import * as React from 'react';

import { WaslaTabBar } from '@/components/ui/bottom-tab-bar';

export default function ProviderLayout() {
  return (
    <Tabs tabBar={(props) => <WaslaTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="services" />
      {/* Phantom tab — intercepted by WaslaTabBar to open action sheet */}
      <Tabs.Screen name="add" options={{ href: null }} />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="clients" options={{ href: null }} />
      <Tabs.Screen name="promote" options={{ href: null }} />
    </Tabs>
  );
}
