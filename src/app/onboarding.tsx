import { useRouter } from 'expo-router';
import * as React from 'react';
import { useRef, useState } from 'react';
import type { FlatListProps } from 'react-native';
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  ChatBubblesIllustration,
  StarBadgeIllustration,
  WomanWithMapIllustration,
} from '@/components/illustrations';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';

const { width: SCREEN_W } = Dimensions.get('window');

type Slide = {
  key: string;
  titleKey: string;
  bodyKey: string;
  Illustration: React.ComponentType<{ size?: number }>;
};

const SLIDES: Slide[] = [
  {
    key: '1',
    titleKey: 'onboarding.screen1_title',
    bodyKey: 'onboarding.screen1_body',
    Illustration: WomanWithMapIllustration,
  },
  {
    key: '2',
    titleKey: 'onboarding.screen2_title',
    bodyKey: 'onboarding.screen2_body',
    Illustration: ChatBubblesIllustration,
  },
  {
    key: '3',
    titleKey: 'onboarding.screen3_title',
    bodyKey: 'onboarding.screen3_body',
    Illustration: StarBadgeIllustration,
  },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [, setIsFirstTime] = useIsFirstTime();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const handleFinish = () => {
    setIsFirstTime(false);
    router.replace('/role-select');
  };

  const handleHaveAccount = () => {
    setIsFirstTime(false);
    router.replace('/(auth)/register');
  };

  const renderItem: FlatListProps<Slide>['renderItem'] = ({ item }) => (
    <View style={styles.slide}>
      <item.Illustration size={200} />
      <Text variant="heading" weight="semibold" style={styles.title}>
        {t(item.titleKey as never)}
      </Text>
      <Text variant="body" style={styles.body}>
        {t(item.bodyKey as never)}
      </Text>
    </View>
  );

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <Screen edges={['top', 'bottom']}>
      <Pressable style={styles.skipBtn} onPress={handleFinish}>
        <Text variant="label" style={styles.skipText}>
          {t('onboarding.skip')}
        </Text>
      </Pressable>

      <FlatList
        ref={flatRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        inverted
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          setCurrentIndex(SLIDES.length - 1 - newIndex);
        }}
        style={{ flex: 1 }}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.ctaContainer}>
        <Button
          variant="primary"
          label={isLast ? t('onboarding.start_now') : t('common.next')}
          onPress={() => {
            if (isLast) {
              handleFinish();
            } else {
              const nextIndex = currentIndex + 1;
              flatRef.current?.scrollToIndex({
                index: SLIDES.length - 1 - nextIndex,
                animated: true,
              });
              setCurrentIndex(nextIndex);
            }
          }}
        />
        <Pressable onPress={handleHaveAccount} style={styles.haveAccount}>
          <Text variant="label" style={styles.haveAccountText}>
            {t('onboarding.have_account')}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  skipBtn: { alignSelf: 'flex-start', padding: 16, minHeight: 48, justifyContent: 'center' },
  skipText: { color: 'hsl(198, 15%, 45%)' },
  slide: {
    width: SCREEN_W,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
    flex: 1,
  },
  title: { textAlign: 'center', fontSize: 24, color: 'hsl(199, 41%, 12%)' },
  body: { textAlign: 'center', color: 'hsl(198, 15%, 45%)', lineHeight: 26 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'hsl(200, 20%, 88%)' },
  dotActive: { backgroundColor: 'hsl(258, 52%, 54%)', width: 24 },
  ctaContainer: { paddingHorizontal: 24, paddingBottom: 16, gap: 12 },
  haveAccount: { alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  haveAccountText: { color: 'hsl(198, 15%, 45%)' },
});
