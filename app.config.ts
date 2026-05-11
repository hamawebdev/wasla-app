import type { ConfigContext, ExpoConfig } from '@expo/config';

import type { AppIconBadgeConfig } from 'app-icon-badge/types';

import 'tsx/cjs';

// adding lint exception as we need to import tsx/cjs before env.ts is imported
// eslint-disable-next-line perfectionist/sort-imports
import Env from './env';

const EXPO_ACCOUNT_OWNER = 'wass70';
const EAS_PROJECT_ID = '2ae6a117-b886-40fd-b905-d0c171b07fba';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.EXPO_PUBLIC_APP_ENV !== 'production',
  badges: [
    {
      text: Env.EXPO_PUBLIC_APP_ENV,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.EXPO_PUBLIC_VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  description: `${Env.EXPO_PUBLIC_NAME} Mobile App`,
  owner: EXPO_ACCOUNT_OWNER,
  scheme: Env.EXPO_PUBLIC_SCHEME,
  slug: 'wasla',
  version: Env.EXPO_PUBLIC_VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.EXPO_PUBLIC_BUNDLE_ID,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2E3C4B',
    },
    package: Env.EXPO_PUBLIC_PACKAGE,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2E3C4B',
        image: './assets/splash-icon.png',
        imageWidth: 150,
      },
    ],
    [
      'expo-font',
      {
        ios: {
          fonts: [
            'node_modules/@expo-google-fonts/rubik/400Regular/Rubik_400Regular.ttf',
            'node_modules/@expo-google-fonts/rubik/500Medium/Rubik_500Medium.ttf',
            'node_modules/@expo-google-fonts/rubik/600SemiBold/Rubik_600SemiBold.ttf',
            'node_modules/@expo-google-fonts/rubik/700Bold/Rubik_700Bold.ttf',
          ],
        },
        android: {
          fonts: [
            {
              fontFamily: 'Rubik',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/rubik/400Regular/Rubik_400Regular.ttf',
                  weight: 400,
                },
                {
                  path: 'node_modules/@expo-google-fonts/rubik/500Medium/Rubik_500Medium.ttf',
                  weight: 500,
                },
                {
                  path: 'node_modules/@expo-google-fonts/rubik/600SemiBold/Rubik_600SemiBold.ttf',
                  weight: 600,
                },
                {
                  path: 'node_modules/@expo-google-fonts/rubik/700Bold/Rubik_700Bold.ttf',
                  weight: 700,
                },
              ],
            },
          ],
        },
      },
    ],
    'expo-localization',
    'expo-router',
    ['app-icon-badge', appIconBadgeConfig],
    ['react-native-edge-to-edge'],
  ],
  extra: {
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },
});
