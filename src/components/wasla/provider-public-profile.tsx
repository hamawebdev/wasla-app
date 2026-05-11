import { useRouter } from 'expo-router';
import { BadgeCheck, MapPin, MessageCircle, ShoppingBag, Star, Store } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { StarRating } from '@/components/ui/star-rating';
import { ServiceCard } from '@/components/wasla/service-card';
import { SegmentedControl } from '@/components/wasla/segmented-control';
import { useProviderById, useServices, useServiceReviews } from '@/api/services/use-services';
import { MOCK_SERVICES } from '@/api/fixtures/services';
import { MOCK_PROVIDERS } from '@/api/fixtures/providers';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

interface Props {
  providerId: string;
  mode?: 'public' | 'preview';
}

const TABS = [
  { key: 'services', label: 'الخدمات' },
  { key: 'reviews', label: 'التقييمات' },
  { key: 'about', label: 'عن المتجر' },
];

export function ProviderPublicProfile({ providerId, mode = 'public' }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('services');

  const { data: provider } = useProviderById(providerId);
  const { data: allServices = [] } = useServices();

  const providerServices = allServices.filter((s) => s.providerId === providerId);

  // Aggregate reviews across services
  const firstServiceId = providerServices[0]?.id ?? '';
  const { data: reviews = [] } = useServiceReviews(firstServiceId);

  if (!provider) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="body" style={{ color: MUTED }}>جارٍ التحميل...</Text>
      </View>
    );
  }

  const firstService = providerServices[0];

  return (
    <View style={styles.container}>
      {/* Preview banner */}
      {mode === 'preview' && (
        <View style={styles.previewBanner}>
          <Text variant="caption" weight="medium" style={styles.previewText}>
            أنتِ تشاهدين متجرك كما يراه العملاء
          </Text>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={styles.cover} />

        {/* Avatar row */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarBorder}>
            <Avatar
              source={provider.avatar ? { uri: provider.avatar } : undefined}
              name={provider.name}
              size={80}
            />
          </View>
          <View style={styles.providerInfo}>
            <View style={styles.nameRow}>
              {provider.verified && (
                <BadgeCheck size={18} color={PRIMARY} />
              )}
              <Text variant="heading" weight="bold" style={styles.providerName}>
                {provider.name}
              </Text>
            </View>
            <View style={styles.cityRow}>
              <MapPin size={14} color={MUTED} />
              <Text variant="caption" style={{ color: MUTED }}>{provider.city}</Text>
            </View>
          </View>
        </View>

        {/* Stats card */}
        <Card elevated style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="heading" weight="bold" style={styles.statValue}>
                {providerServices.length}
              </Text>
              <Text variant="caption" style={{ color: MUTED, textAlign: 'center' }}>خدمة</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="heading" weight="bold" style={styles.statValue}>
                {provider.rating}
              </Text>
              <Text variant="caption" style={{ color: MUTED, textAlign: 'center' }}>تقييم</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text variant="heading" weight="bold" style={styles.statValue}>95%</Text>
              <Text variant="caption" style={{ color: MUTED, textAlign: 'center' }}>استجابة</Text>
            </View>
          </View>
        </Card>

        {/* Tabs */}
        <View style={styles.tabsWrapper}>
          <SegmentedControl
            segments={TABS}
            selected={activeTab}
            onChange={setActiveTab}
          />
        </View>

        {/* Services tab */}
        {activeTab === 'services' && (
          <View style={styles.tabContent}>
            {providerServices.length === 0 && (
              <Text variant="body" style={{ color: MUTED, textAlign: 'center', marginTop: 16 }}>
                لا توجد خدمات بعد
              </Text>
            )}
            {providerServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        )}

        {/* Reviews tab */}
        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            {reviews.length === 0 && (
              <Text variant="body" style={{ color: MUTED, textAlign: 'center', marginTop: 16 }}>
                لا توجد تقييمات بعد
              </Text>
            )}
            {reviews.map((review) => (
              <Card key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewMeta}>
                    <Text variant="label" weight="semibold" style={{ color: FOREGROUND, textAlign: 'right' }}>
                      {review.authorName}
                    </Text>
                    <Text variant="caption" style={{ color: MUTED, textAlign: 'right' }}>
                      {review.date}
                    </Text>
                  </View>
                  <Avatar name={review.authorName} size={36} />
                </View>
                <StarRating value={review.rating} size={14} />
                <Text variant="body" style={{ color: FOREGROUND, textAlign: 'right' }}>
                  {review.comment}
                </Text>
              </Card>
            ))}
          </View>
        )}

        {/* About tab */}
        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            <Card>
              <Text variant="body" weight="semibold" style={styles.aboutTitle}>
                نبذة عني
              </Text>
              <Text variant="body" style={{ color: MUTED, textAlign: 'right', lineHeight: 26 }}>
                {provider.bio ?? 'لا توجد نبذة حالياً.'}
              </Text>
            </Card>
          </View>
        )}

        {/* Spacer for sticky bottom */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky bottom CTA — hidden in preview mode */}
      {mode === 'public' && (
        <View style={styles.stickyBottom}>
          <Button
            label="تواصل معي"
            variant="outline"
            size="md"
            style={styles.ctaBtn}
            onPress={() => {}}
          />
          {firstService && (
            <Button
              label="احجزي الآن"
              variant="primary"
              size="md"
              style={styles.ctaBtn}
              onPress={() => router.push(`/(customer)/booking/${firstService.id}/step-1`)}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  previewBanner: {
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  previewText: { color: '#fff' },
  scroll: { flex: 1 },
  cover: { height: 150 },
  avatarSection: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: -40,
    gap: 14,
  },
  avatarBorder: {
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 44,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  providerInfo: { flex: 1, paddingBottom: 6, gap: 4 },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  providerName: { color: FOREGROUND, textAlign: 'right', fontSize: 20 },
  cityRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  statsCard: { margin: 16, padding: 0, paddingVertical: 4 },
  statsRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statValue: { color: PRIMARY, fontSize: 22 },
  statDivider: { width: 1, height: 40, backgroundColor: BORDER },
  tabsWrapper: { paddingHorizontal: 16, marginBottom: 8 },
  tabContent: { paddingHorizontal: 16, gap: 12 },
  reviewCard: { gap: 10 },
  reviewHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewMeta: { gap: 2 },
  aboutTitle: { color: FOREGROUND, textAlign: 'right', marginBottom: 8 },
  stickyBottom: {
    flexDirection: 'row-reverse',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  ctaBtn: { flex: 1 },
});
