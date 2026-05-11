import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronRight, HelpCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useHelpArticles, useHelpCategories } from '@/api/services/use-help';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

export default function HelpCategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [openArticleId, setOpenArticleId] = useState<string | null>(null);

  const { data: categories = [] } = useHelpCategories();
  const { data: articles = [] } = useHelpArticles(id);

  const category = categories.find((c) => c.id === id);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronRight size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          {category?.label ?? 'المساعدة'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {articles.length === 0 && (
          <Text variant="body" style={{ color: MUTED, textAlign: 'center', marginTop: 32 }}>
            لا توجد مقالات في هذا التصنيف
          </Text>
        )}

        {articles.map((article) => {
          const isOpen = openArticleId === article.id;
          return (
            <View key={article.id} style={styles.accordionItem}>
              <Pressable
                style={styles.accordionHeader}
                onPress={() => setOpenArticleId(isOpen ? null : article.id)}
              >
                <HelpCircle size={18} color={PRIMARY} />
                <Text variant="body" weight="medium" style={styles.accordionTitle}>
                  {article.title}
                </Text>
              </Pressable>
              {isOpen && (
                <View style={styles.accordionBody}>
                  <Text variant="body" style={styles.accordionBodyText}>
                    {article.body}
                  </Text>
                  <Pressable onPress={() => router.push(`/(shared)/help/${article.id}`)}>
                    <Text variant="caption" style={styles.readMore}>قراءة المزيد ←</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
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
  appBarTitle: { color: FOREGROUND, fontSize: 18 },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 8 },

  accordionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  accordionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    padding: 16,
  },
  accordionTitle: { flex: 1, color: FOREGROUND, textAlign: 'right' },
  accordionBody: {
    padding: 16,
    paddingTop: 0,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  accordionBodyText: { color: MUTED, textAlign: 'right', lineHeight: 24 },
  readMore: { color: PRIMARY, textAlign: 'right', fontWeight: '500' },
});
