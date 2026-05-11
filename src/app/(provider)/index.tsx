import { useRouter } from 'expo-router';
import { Plus, Star, TrendingUp, Users } from 'lucide-react-native';
import * as React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { MOCK_SERVICES } from '@/api/fixtures/services';
import { useProviderStore } from '@/features/provider/use-provider-store';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const DESTRUCTIVE = 'hsl(0, 84%, 60%)';

const PROVIDER_ID = 'p1';
const MY_SERVICES = MOCK_SERVICES.filter((s) => s.providerId === PROVIDER_ID);

const TODAY = new Date('2026-05-10');
const ARABIC_DAYS = ['أ', 'ث', 'ر', 'خ', 'ج', 'س', 'أ'];
const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - TODAY.getDay() + i);
  return { day: ARABIC_DAYS[i], date: d.getDate(), isToday: d.getDate() === TODAY.getDate() };
});

export default function ProviderDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { activeToggles, toggleService, isActive } = useProviderStore();

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="heading" weight="semibold" style={styles.greeting}>
            {t('provider.dashboard_title')}
          </Text>
          <Text variant="caption" style={styles.subtitle}>أم رشيد</Text>
        </View>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>3</Text>
        </View>
      </View>

      {/* Stat cards */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard} elevated>
          <Users size={20} color={DESTRUCTIVE} />
          <Text variant="heading" weight="semibold" style={[styles.statValue, { color: DESTRUCTIVE }]}>
            3
          </Text>
          <Text variant="caption" style={styles.statLabel}>{t('provider.new_bookings')}</Text>
        </Card>

        <Card style={styles.statCard} elevated>
          <Star size={20} color="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" />
          <Text variant="heading" weight="semibold" style={[styles.statValue, { color: 'hsl(38, 92%, 35%)' }]}>
            4.9
          </Text>
          <Text variant="caption" style={styles.statLabel}>{t('provider.overall_rating')}</Text>
        </Card>

        <Card style={styles.statCard} elevated>
          <TrendingUp size={20} color={PRIMARY} />
          <Text variant="heading" weight="semibold" style={[styles.statValue, { color: PRIMARY }]}>
            38k
          </Text>
          <Text variant="caption" style={styles.statLabel}>{t('provider.monthly_earnings')}</Text>
        </Card>
      </View>

      {/* Weekly calendar strip */}
      <Card style={styles.calendarCard}>
        <Text variant="label" weight="semibold" style={styles.sectionTitle}>
          أوقات الإتاحة هذا الأسبوع
        </Text>
        <View style={styles.weekStrip}>
          {WEEK_DAYS.map((d) => (
            <View key={d.date} style={[styles.dayCol, d.isToday && styles.dayColToday]}>
              <Text variant="caption" style={[styles.dayLabel, d.isToday && { color: '#fff' }]}>
                {d.day}
              </Text>
              <Text variant="caption" style={[styles.dayNum, d.isToday && { color: '#fff' }]}>
                {d.date}
              </Text>
            </View>
          ))}
        </View>
        <Pressable
          style={styles.clientsBtn}
          onPress={() => router.push('/(provider)/clients')}
        >
          <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>
            عرض الطلبات الجديدة (3)
          </Text>
        </Pressable>
      </Card>

      {/* My services */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="label" weight="semibold" style={styles.sectionTitle}>
            {t('provider.my_services')}
          </Text>
        </View>

        {MY_SERVICES.length === 0 ? (
          <Text variant="caption" style={{ textAlign: 'center', color: MUTED, padding: 20 }}>
            لا توجد خدمات مضافة بعد
          </Text>
        ) : (
          MY_SERVICES.map((service) => {
            const active = isActive(service.id);
            return (
              <Pressable
                key={service.id}
                style={styles.serviceRow}
                onPress={() => router.push(`/(provider)/services/${service.id}` as any)}
              >
                <Switch
                  value={active}
                  onValueChange={() => toggleService(service.id)}
                  trackColor={{ false: 'hsl(198, 21%, 88%)', true: 'hsl(258, 52%, 72%)' }}
                  thumbColor={active ? PRIMARY : '#fff'}
                />
                <View style={styles.serviceInfo}>
                  <Text
                    variant="body"
                    weight="medium"
                    numberOfLines={1}
                    style={{ textAlign: 'right', color: DARK }}
                  >
                    {service.title}
                  </Text>
                  <Text variant="caption" style={{ textAlign: 'right', color: MUTED }}>
                    {service.price.toLocaleString('ar-DZ')} د.ج
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      {/* Spacer for FAB */}
      <View style={{ height: 80 }} />

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/(provider)/services/new')}
      >
        <Plus size={24} color="#fff" />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 12,
  },
  headerText: { alignItems: 'flex-end', gap: 2 },
  greeting: { textAlign: 'right', color: DARK, fontSize: 18 },
  subtitle: { color: MUTED, textAlign: 'right' },
  newBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DESTRUCTIVE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBadgeText: { color: '#fff', fontSize: 13, fontFamily: 'Rubik', fontWeight: '700' },

  statsRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    padding: 12,
  },
  statValue: { fontSize: 22, color: DARK },
  statLabel: { textAlign: 'center', color: MUTED, fontSize: 11 },

  calendarCard: { marginHorizontal: 16, gap: 12, marginBottom: 12 },
  weekStrip: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  dayColToday: { backgroundColor: PRIMARY },
  dayLabel: { color: MUTED, fontSize: 11 },
  dayNum: { color: DARK, fontFamily: 'Rubik', fontSize: 14 },
  clientsBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'hsl(198, 21%, 88%)',
  },

  section: { paddingHorizontal: 16, gap: 8 },
  sectionHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { textAlign: 'right', color: DARK, fontSize: 16, marginBottom: 4 },

  serviceRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  serviceInfo: { flex: 1, gap: 2 },

  fab: {
    position: 'absolute',
    bottom: 24,
    start: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
