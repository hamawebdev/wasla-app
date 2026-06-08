import { Link, Stack } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t('errors.page_not_found_title') }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text variant="heading" weight="semibold" style={{ textAlign: 'center', marginBottom: 16 }}>
          {t('errors.page_not_found')}
        </Text>
        <Link href="/">
          <Text variant="body" style={{ color: 'hsl(258, 52%, 54%)', textDecorationLine: 'underline' }}>
            {t('categoryBrowse.go_home')}
          </Text>
        </Link>
      </View>
    </>
  );
}
