import { Tabs } from 'expo-router';
import * as React from 'react';

import { WaslaTabBar } from '@/components/ui/bottom-tab-bar';

export default function CustomerLayout() {
  return (
    <Tabs tabBar={(props) => <WaslaTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="loyalty" options={{ href: null }} />
      <Tabs.Screen name="favorites" options={{ href: null }} />
      <Tabs.Screen name="map" options={{ href: null }} />
    </Tabs>
  );
}
