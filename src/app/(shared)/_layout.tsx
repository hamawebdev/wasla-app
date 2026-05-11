import { Stack } from 'expo-router';
import * as React from 'react';

export default function SharedLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
