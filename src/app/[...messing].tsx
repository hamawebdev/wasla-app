import { Link, Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'الصفحة غير موجودة' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text variant="heading" weight="semibold" style={{ textAlign: 'center', marginBottom: 16 }}>
          هذه الصفحة غير موجودة
        </Text>
        <Link href="/">
          <Text variant="body" style={{ color: 'hsl(258, 52%, 54%)', textDecorationLine: 'underline' }}>
            العودة للرئيسية
          </Text>
        </Link>
      </View>
    </>
  );
}
