import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  HelpCircle,
  MessageCircle,
  Phone,
  Search,
  User,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useHelpArticles } from '@/api/services/use-help';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

type CategoryId = 'bookings' | 'payment' | 'account' | 'complaints';

const CATEGORY_ICONS: Record<CategoryId, React.ReactNode> = {
  bookings: <Calendar size={28} color={PRIMARY} />,
  payment: <CreditCard size={28} color={PRIMARY} />,
  account: <User size={28} color={PRIMARY} />,
  complaints: <AlertTriangle size={28} color="hsl(41, 100%, 38%)" />,
};

const CATEGORY_LABELS: Record<CategoryId, string> = {
  bookings: 'الحجوزات',
  payment: 'الدفع',
  account: 'الحساب',
  complaints: 'الشكاوى',
};

export default function HelpCenterScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [openArticleId, setOpenArticleId] = useState<string | null>(null);

  const { data: allArticles = [] } = useHelpArticles();

  const filtered = search.trim()
    ? allArticles.filter(
        (a) =>
          a.title.includes(search) ||
          a.body.includes(search),
      )
    : allArticles;

  const popularArticles = allArticles.slice(0, 5);

  const displayArticles = search.trim() ? filtered : popularArticles;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronRight size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          مركز المساعدة
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={18} color={MUTED} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="ابحثي في المساعدة..."
            placeholderTextColor={MUTED}
            style={styles.searchInput}
            textAlign="right"
          />
        </View>

        {/* Category grid (only show when not searching) */}
        {!search.trim() && (
          <View>
            <Text variant="body" weight="semibold" style={styles.sectionTitle}>
              التصنيفات
            </Text>
            <View style={styles.categoryGrid}>
              {(Object.keys(CATEGORY_ICONS) as CategoryId[]).map((catId) => (
                <Pressable
                  key={catId}
                  style={({ pressed }) => [styles.categoryCard, pressed && styles.pressed]}
                  onPress={() => router.push({ pathname: '/(shared)/help/category', params: { id: catId } })}
                >
                  {CATEGORY_ICONS[catId]}
                  <Text variant="label" weight="medium" style={styles.categoryLabel}>
                    {CATEGORY_LABELS[catId]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Articles accordion */}
        <View>
          <Text variant="body" weight="semibold" style={styles.sectionTitle}>
            {search.trim() ? 'نتائج البحث' : 'مقالات شائعة'}
          </Text>
          {displayArticles.length === 0 && (
            <Text variant="body" style={{ color: MUTED, textAlign: 'center', marginTop: 16 }}>
              لم نجد نتائج مطابقة
            </Text>
          )}
          {displayArticles.map((article) => {
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
                  {isOpen
                    ? <ChevronUp size={18} color={MUTED} />
                    : <ChevronDown size={18} color={MUTED} />
                  }
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
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <View style={styles.footerCard}>
          <Text variant="body" weight="semibold" style={{ textAlign: 'center', color: FOREGROUND }}>
            لم تجدي ما تبحثين عنه؟
          </Text>
          <View style={styles.footerBtns}>
            <Button
              label="محادثة مباشرة"
              variant="primary"
              size="md"
              style={styles.footerBtn}
              onPress={() => {}}
            />
            <Button
              label="اتصال"
              variant="outline"
              size="md"
              style={styles.footerBtn}
              onPress={() => Linking.openURL('tel:+213000000000')}
              leftIcon={<Phone size={16} color={PRIMARY} />}
            />
          </View>
        </View>
      </View>
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
  content: { padding: 16, gap: 20, paddingBottom: 120 },

  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Rubik',
    fontSize: 15,
    color: FOREGROUND,
  },

  sectionTitle: { color: FOREGROUND, textAlign: 'right', marginBottom: 12 },

  categoryGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  pressed: { opacity: 0.85 },
  categoryLabel: { color: FOREGROUND, textAlign: 'center' },

  accordionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
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

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  footerBtns: { flexDirection: 'row-reverse', gap: 12 },
  footerBtn: { flex: 1 },
});
