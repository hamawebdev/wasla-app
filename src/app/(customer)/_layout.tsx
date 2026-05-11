import { Tabs } from 'expo-router';
import * as React from 'react';

import { WaslaTabBar } from '@/components/ui/bottom-tab-bar';

export default function CustomerLayout() {
  return (
    <Tabs tabBar={(props) => <WaslaTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="chat" options={{ href: null }} />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="service" options={{ href: null }} />
      <Tabs.Screen name="booking" options={{ href: null }} />
      <Tabs.Screen name="loyalty" options={{ href: null }} />
      <Tabs.Screen name="bookings" options={{ href: null }} />
      <Tabs.Screen name="review" options={{ href: null }} />
    </Tabs>
  );
}
