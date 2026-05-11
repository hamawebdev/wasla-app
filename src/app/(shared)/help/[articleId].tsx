import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useHelpArticle } from '@/api/services/use-help';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

export default function HelpArticleScreen() {
  const router = useRouter();
  const { articleId } = useLocalSearchParams<{ articleId: string }>();
  const { data: article, isLoading } = useHelpArticle(articleId ?? '');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronRight size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          {article?.title ?? 'المساعدة'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <Text variant="body" style={{ color: MUTED, textAlign: 'center' }}>
            جارٍ التحميل...
          </Text>
        )}
        {article && (
          <View style={styles.card}>
            <Text variant="heading" weight="semibold" style={styles.title}>
              {article.title}
            </Text>
            <View style={styles.divider} />
            <Text variant="body" style={styles.body}>
              {article.body}
            </Text>
          </View>
        )}
        {!article && !isLoading && (
          <Text variant="body" style={{ color: MUTED, textAlign: 'center', marginTop: 32 }}>
            لم يتم العثور على المقالة
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  appBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: { padding: 4 },
  appBarTitle: { color: FOREGROUND, fontSize: 18, flex: 1, textAlign: 'center' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    gap: 16,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  title: { color: FOREGROUND, textAlign: 'right', lineHeight: 34 },
  divider: { height: 1, backgroundColor: BORDER },
  body: { color: FOREGROUND, textAlign: 'right', lineHeight: 28 },
});
