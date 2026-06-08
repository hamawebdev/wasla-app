import { useRouter } from 'expo-router';
import { BadgeCheck, MapPin, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { Text } from '@/components/ui/text';
import { useProviderById, useServices, useServiceReviews } from '@/api/services/use-services';
import { formatNumber } from '@/lib/format';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const PRIMARY_CONTAINER = 'hsl(258, 80%, 92%)';
const SECONDARY_CONTAINER = 'hsl(265, 90%, 92%)';
const TERTIARY = 'hsl(45, 100%, 35%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const SURFACE = '#fff';
const SURFACE_LOW = 'hsl(280, 33%, 97%)';
const BORDER = 'hsl(198, 21%, 88%)';

const COVER_IMAGE = 'https://picsum.photos/seed/wasla-cover/800/400';

const TABS = [
  { key: 'services', label: 'providerPublic.tab_services' },
  { key: 'reviews', label: 'providerPublic.tab_reviews' },
  { key: 'about', label: 'providerPublic.tab_about' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

interface Props {
  providerId: string;
  mode?: 'public' | 'preview';
}

export function ProviderPublicProfile({ providerId, mode = 'public' }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('services');

  const { data: provider } = useProviderById(providerId);
  const { data: allServices = [] } = useServices();

  const providerServices = allServices.filter((s) => s.providerId === providerId);
  const firstServiceId = providerServices[0]?.id ?? '';
  const { data: reviews = [] } = useServiceReviews(firstServiceId);

  if (!provider) {
    return (
      <View style={styles.loading}>
        <Text variant="body" style={{ color: MUTED }}>{t('common.loading')}</Text>
      </View>
    );
  }

  const firstService = providerServices[0];

  return (
    <View style={styles.container}>
      {mode === 'preview' && (
        <View style={styles.previewBanner}>
          <Text variant="caption" weight="medium" style={styles.previewText}>
            {t('providerPublic.preview_banner')}
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[4]}
      >
        {/* Cover + Avatar */}
        <View style={styles.heroWrap}>
          <View style={styles.cover}>
            <Image source={{ uri: COVER_IMAGE }} style={styles.coverImage} />
          </View>
          <View style={styles.avatarBorder}>
            <Avatar
              source={provider.avatar ? { uri: provider.avatar } : undefined}
              name={provider.name}
              size={80}
            />
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.providerInfo}>
          <View style={styles.nameRow}>
            <Text variant="heading" weight="bold" style={styles.providerName}>
              {provider.name}
            </Text>
            {provider.verified && <BadgeCheck size={20} color={PRIMARY} fill={PRIMARY} stroke="#fff" />}
          </View>
          <View style={styles.cityRow}>
            <MapPin size={14} color={MUTED} />
            <Text variant="caption" style={{ color: MUTED }}>{provider.city}</Text>
          </View>
        </View>

        {/* Stats Bento */}
        <View style={styles.statsGrid}>
          <View style={styles.statTile}>
            <Text variant="heading" weight="bold" style={styles.statValue}>
              {providerServices.length}
            </Text>
            <Text variant="caption" style={styles.statLabel}>{t('providerPublic.tab_services')}</Text>
          </View>
          <View style={styles.statTile}>
            <View style={styles.ratingRow}>
              <Text variant="heading" weight="bold" style={styles.statValue}>
                {provider.rating}
              </Text>
              <Star size={16} color={TERTIARY} fill={TERTIARY} />
            </View>
            <Text variant="caption" style={styles.statLabel}>{t('providerPublic.rating')}</Text>
          </View>
          <View style={styles.statTile}>
            <Text variant="heading" weight="bold" style={styles.statValue}>95%</Text>
            <Text variant="caption" style={styles.statLabel}>{t('providerPublic.response_rate')}</Text>
          </View>
        </View>

        {/* Bio */}
        {provider.bio && (
          <View style={styles.bioSection}>
            <Text variant="body" style={styles.bioText}>{provider.bio}</Text>
          </View>
        )}

        {/* Sticky Tabs */}
        <View style={styles.tabsBar}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={styles.tabBtn}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  variant="label"
                  weight={active ? 'semibold' : 'medium'}
                  style={[styles.tabLabel, active && styles.tabLabelActive]}
                >
                  {t(tab.label)}
                </Text>
                {active && <View style={styles.tabIndicator} />}
              </Pressable>
            );
          })}
        </View>

        {/* Tab content */}
        {activeTab === 'services' && (
          <View style={styles.servicesGrid}>
            {providerServices.length === 0 && (
              <Text variant="body" style={styles.emptyText}>{t('providerPublic.no_services')}</Text>
            )}
            {providerServices.map((service) => (
              <Pressable
                key={service.id}
                style={styles.serviceCard}
                onPress={() => router.push(`/(customer)/service/${service.id}`)}
              >
                <View style={styles.serviceImageWrap}>
                  {service.images?.[0] ? (
                    <Image source={{ uri: service.images[0] }} style={styles.serviceImage} />
                  ) : (
                    <View style={[styles.serviceImage, { backgroundColor: SURFACE_LOW }]} />
                  )}
                  {service.featured && (
                    <View style={styles.serviceBadge}>
                      <Text variant="caption" weight="medium" style={styles.serviceBadgeText}>
                        {t('providerPublic.in_demand')}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.serviceBody}>
                  <Text
                    variant="label"
                    weight="medium"
                    numberOfLines={2}
                    style={styles.serviceTitle}
                  >
                    {service.title}
                  </Text>
                  <Text variant="caption" weight="medium" style={styles.servicePrice}>
                    {service.priceFrom ? `${t('common.starting_from')} ` : ''}{formatNumber(service.price)} {t('common.dzd')}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.tabContent}>
            {reviews.length === 0 && (
              <Text variant="body" style={styles.emptyText}>{t('providerPublic.no_reviews')}</Text>
            )}
            {reviews.map((review) => (
              <Card key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewMeta}>
                    <Text variant="label" weight="semibold" style={{ color: FOREGROUND, textAlign: textAlignStart }}>
                      {review.authorName}
                    </Text>
                    <Text variant="caption" style={{ color: MUTED, textAlign: textAlignStart }}>
                      {review.date}
                    </Text>
                  </View>
                  <Avatar name={review.authorName} size={36} />
                </View>
                <StarRating value={review.rating} size={14} />
                <Text variant="body" style={{ color: FOREGROUND, textAlign: textAlignStart }}>
                  {review.comment}
                </Text>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            <Card>
              <Text variant="body" weight="semibold" style={styles.aboutTitle}>
                {t('providerPublic.about')}
              </Text>
              <Text variant="body" style={{ color: MUTED, textAlign: textAlignStart, lineHeight: 26 }}>
                {provider.bio ?? t('providerPublic.no_bio')}
              </Text>
            </Card>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {mode === 'public' && (
        <View style={styles.stickyBottom}>
          <Button
            label={t('providerPublic.contact')}
            variant="outline"
            size="md"
            style={styles.ctaBtn}
            onPress={() => {}}
          />
          {firstService && (
            <Button
              label={t('providerPublic.book_now')}
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
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  previewBanner: {
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  previewText: { color: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  heroWrap: { position: 'relative' },
  cover: { height: 180, width: '100%', overflow: 'hidden', backgroundColor: PRIMARY_CONTAINER },
  coverImage: { ...StyleSheet.absoluteFillObject, opacity: 0.6, resizeMode: 'cover' },
  avatarBorder: {
    position: 'absolute',
    bottom: -40,
    right: 16,
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: SURFACE,
    backgroundColor: SURFACE_LOW,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  providerInfo: { paddingHorizontal: 16, paddingTop: 52, paddingBottom: 8 },
  nameRow: { flexDirection: rowDirection, alignItems: 'center', gap: 6 },
  providerName: { color: FOREGROUND, textAlign: textAlignStart, fontSize: 22 },
  cityRow: { flexDirection: rowDirection, alignItems: 'center', gap: 4, marginTop: 4 },

  statsGrid: {
    flexDirection: rowDirection,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statTile: {
    flex: 1,
    backgroundColor: SURFACE_LOW,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: { flexDirection: rowDirection, alignItems: 'center', gap: 4 },
  statValue: { color: PRIMARY, fontSize: 22 },
  statLabel: { color: MUTED, marginTop: 2, fontSize: 12 },

  bioSection: { paddingHorizontal: 16, paddingVertical: 8 },
  bioText: { color: MUTED, textAlign: textAlignStart, lineHeight: 26 },

  tabsBar: {
    flexDirection: rowDirection,
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginTop: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: { color: MUTED, fontSize: 14 },
  tabLabelActive: { color: PRIMARY },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: PRIMARY,
  },

  servicesGrid: {
    flexDirection: rowDirection,
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: SURFACE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  serviceImageWrap: { height: 120, width: '100%', position: 'relative' },
  serviceImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  serviceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: SECONDARY_CONTAINER,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  serviceBadgeText: { color: PRIMARY, fontSize: 10 },
  serviceBody: { padding: 10, gap: 6 },
  serviceTitle: { color: FOREGROUND, textAlign: textAlignStart, minHeight: 36 },
  servicePrice: { color: PRIMARY },

  tabContent: { paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  emptyText: { color: MUTED, textAlign: 'center', marginTop: 16 },

  reviewCard: { gap: 10 },
  reviewHeader: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewMeta: { gap: 2 },
  aboutTitle: { color: FOREGROUND, textAlign: textAlignStart, marginBottom: 8 },

  stickyBottom: {
    flexDirection: rowDirection,
    gap: 12,
    padding: 16,
    backgroundColor: SURFACE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  ctaBtn: { flex: 1 },
});
