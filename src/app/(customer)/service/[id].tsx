import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, Calendar, ChevronLeft, Heart, MapPin, Share2, Star } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScreenSkeleton } from '@/components/ui/skeleton';
import { StarRating } from '@/components/ui/star-rating';
import { Text } from '@/components/ui/text';
import { useService, useServiceReviews } from '@/api/services/use-services';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading } = useService(id);
  const { data: reviews } = useServiceReviews(id);

  if (isLoading) return <ScreenSkeleton variant="detail" />;
  if (!data) return null;

  const { service, provider } = data;

  return (
    <View style={{ flex: 1, backgroundColor: 'hsl(180, 25%, 98%)' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image carousel */}
        <View style={styles.hero}>
          <Image
            source={{ uri: service.images[activeImage] }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Overlay actions */}
          <View style={[styles.heroActions, { top: insets.top + 8 }]}>
            <Pressable onPress={() => setSaved(!saved)} style={styles.heroBtn}>
              <Heart size={20} color={saved ? '#ef4444' : '#fff'} fill={saved ? '#ef4444' : 'none'} />
            </Pressable>
            <Pressable style={styles.heroBtn}>
              <Share2 size={20} color="#fff" />
            </Pressable>
            <Pressable onPress={() => router.back()} style={styles.heroBtn}>
              <ArrowRight size={20} color="#fff" />
            </Pressable>
          </View>
          {/* Dot indicators */}
          <View style={styles.imageDots}>
            {service.images.map((_, i) => (
              <Pressable key={i} onPress={() => setActiveImage(i)}>
                <View style={[styles.imageDot, i === activeImage && styles.imageDotActive]} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.body}>
          {/* Provider bar */}
          {provider && (
            <Card style={styles.providerBar}>
              <Pressable
                style={styles.providerRow}
                onPress={() => router.push(`/(customer)/provider/${provider.id}`)}
              >
                <View style={styles.avatarRing}>
                  <Avatar
                    source={provider.avatar ? { uri: provider.avatar } : undefined}
                    name={provider.name}
                    size={60}
                    online={provider.online}
                  />
                </View>
                <View style={styles.providerInfo}>
                  <View style={styles.providerNameRow}>
                    {provider.verified && (
                      <Badge label={t('common.verified')} variant="primary" />
                    )}
                    <Text variant="body" weight="semibold" style={styles.providerName}>
                      {provider.name}
                    </Text>
                  </View>
                  <View style={styles.providerMeta}>
                    <Star size={13} color="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" />
                    <Text variant="caption" weight="medium" style={styles.providerRating}>
                      {provider.rating.toFixed(1)}
                    </Text>
                    <Text variant="caption" style={styles.providerMetaMuted}>
                      ({provider.reviewCount})
                    </Text>
                    <View style={styles.metaDot} />
                    <MapPin size={12} color={MUTED} />
                    <Text variant="caption" style={styles.providerMetaMuted} numberOfLines={1}>
                      {provider.city}
                    </Text>
                  </View>
                </View>
                <View style={styles.viewStore}>
                  <Text variant="label" weight="medium" style={styles.viewStoreText}>
                    {t('service.view_store')}
                  </Text>
                  <ChevronLeft size={16} color={PRIMARY} />
                </View>
              </Pressable>
            </Card>
          )}

          {/* Title + description */}
          <Text variant="heading" weight="semibold" style={styles.serviceTitle}>
            {service.title}
          </Text>
          <Text variant="body" style={styles.description} numberOfLines={expanded ? undefined : 4}>
            {service.description}
          </Text>
          {!expanded && (
            <Pressable onPress={() => setExpanded(true)}>
              <Text variant="label" style={styles.expandLink}>{t('common.see_more')}</Text>
            </Pressable>
          )}

          {/* Info grid */}
          <View style={styles.infoGrid}>
            <InfoCard label={t('service.price')} value={`${service.price.toLocaleString('ar-DZ')} د.ج`} />
            <InfoCard label={t('service.duration')} value={service.duration} />
            <InfoCard label={t('service.type')} value={service.type} />
            <InfoCard label={t('service.payment')} value={service.paymentMethod} />
          </View>

          {/* Reviews */}
          <Text variant="heading" weight="semibold" style={[styles.serviceTitle, { fontSize: 18 }]}>
            {t('service.reviews_title')}
          </Text>

          {reviews && reviews.length > 0 && (
            <Card style={styles.ratingSummary}>
              <View style={styles.ratingRow}>
                <View>
                  <StarRating value={service.rating} showCount count={service.reviewCount} />
                </View>
                <Text variant="heading" weight="semibold" style={styles.ratingNumber}>
                  {service.rating.toFixed(1)}
                </Text>
              </View>
            </Card>
          )}

          {reviews?.map((review) => (
            <Card key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewMeta}>
                  <Text variant="caption" style={{ color: MUTED }}>{review.date}</Text>
                  <StarRating value={review.rating} size={13} />
                </View>
                <View style={styles.reviewAuthor}>
                  <Text variant="label" weight="medium" style={{ color: 'hsl(199, 41%, 12%)' }}>
                    {review.authorName}
                  </Text>
                  <Avatar
                    source={review.authorAvatar ? { uri: review.authorAvatar } : undefined}
                    name={review.authorName}
                    size={36}
                  />
                </View>
              </View>
              <Text variant="body" style={styles.reviewComment}>{review.comment}</Text>
            </Card>
          ))}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button
          variant="secondary"
          label={t('service.chat')}
          onPress={() => router.push('/(customer)/chat')}
          style={styles.halfBtn}
        />
        <Button
          variant="primary"
          label={t('service.book_now')}
          leftIcon={<Calendar size={18} color="#fff" />}
          onPress={() => router.push(`/(customer)/booking/${service.id}/step-1`)}
          style={styles.halfBtn}
        />
      </View>
    </View>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.infoCard}>
      <Text variant="caption" style={{ color: MUTED, textAlign: 'right' }}>{label}</Text>
      <Text variant="label" weight="semibold" style={{ color: 'hsl(199, 41%, 12%)', textAlign: 'right' }}>
        {value}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: { position: 'relative' },
  heroImage: { width: '100%', aspectRatio: 16 / 9 },
  heroActions: {
    position: 'absolute',
    right: 0,
    left: 0,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  heroBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageDots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  imageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  imageDotActive: { backgroundColor: PRIMARY, width: 18 },

  body: { padding: 16, gap: 14 },

  providerBar: { padding: 14 },
  providerRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  avatarRing: {
    padding: 3,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'hsl(258, 52%, 88%)',
    backgroundColor: '#fff',
  },
  providerInfo: { flex: 1, gap: 6, alignItems: 'flex-end' },
  providerNameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  providerName: { color: 'hsl(199, 41%, 12%)', fontSize: 16 },
  providerMeta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  providerRating: { color: 'hsl(199, 41%, 18%)' },
  providerMetaMuted: { color: MUTED },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'hsl(198, 15%, 70%)',
    marginHorizontal: 4,
  },
  viewStore: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 2,
    minHeight: 32,
  },
  viewStoreText: { color: PRIMARY },

  serviceTitle: { textAlign: 'right', fontSize: 22, color: 'hsl(199, 41%, 12%)' },
  description: { textAlign: 'right', color: 'hsl(199, 41%, 20%)', lineHeight: 26 },
  expandLink: { color: PRIMARY, textAlign: 'right' },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoCard: { width: '47%', padding: 12, gap: 4 },

  ratingSummary: { padding: 14 },
  ratingRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  ratingNumber: { fontSize: 40, color: PRIMARY },

  reviewCard: { gap: 8, padding: 14 },
  reviewHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'flex-start' },
  reviewAuthor: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  reviewMeta: { alignItems: 'flex-start', gap: 4 },
  reviewComment: { textAlign: 'right', color: 'hsl(199, 41%, 18%)', lineHeight: 24 },

  actionBar: {
    flexDirection: 'row-reverse',
    gap: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'hsl(198, 21%, 88%)',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  halfBtn: { flex: 1 },
});
