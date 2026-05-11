import { Redirect, SplashScreen } from 'expo-router';
import * as React from 'react';
import { useCallback, useEffect } from 'react';

import { useAuthStore } from '@/features/auth/use-auth-store';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';

export default function AppGate() {
  const status = useAuthStore.use.status();
  const role = useAuthStore.use.role();
  const setupComplete = useAuthStore.use.setupComplete();
  const [isFirstTime] = useIsFirstTime();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => hideSplash(), 600);
    }
  }, [hideSplash, status]);

  if (status === 'idle') return null;

  if (isFirstTime) return <Redirect href="/onboarding" />;
  if (status === 'signOut') return <Redirect href="/role-select" />;

  if (role === 'provider') {
    if (!setupComplete) return <Redirect href="/(auth)/provider-setup" />;
    return <Redirect href="/(provider)/" />;
  }

  return <Redirect href="/(customer)/" />;
}
