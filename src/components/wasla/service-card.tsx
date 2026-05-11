import { useRouter } from 'expo-router';
import { Heart, MapPin } from 'lucide-react-native';
import * as React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { Text } from '@/components/ui/text';
import { useIsFavorite, useToggleFavorite } from '@/api/services/use-favorites';
import type { Provider, Service } from '@/api/types';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const HEART_COLOR = 'hsl(0, 84%, 60%)';

interface Props {
  service: Service;
  provider?: Provider;
  featured?: boolean;
  showFavorite?: boolean;
}

export function ServiceCard({ service, provider, featured = false, showFavorite = true }: Props) {
  const router = useRouter();
  const isFavorite = useIsFavorite(service.id);
  const toggle = useToggleFavorite();

  return (
    <Pressable
      onPress={() => router.push(`/(customer)/service/${service.id}`)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed, featured && styles.featured]}
    >
      {/* Hero image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: service.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Favorite button */}
        {showFavorite && (
          <Pressable
            style={styles.heartBtn}
            onPress={(e) => {
              e.stopPropagation();
              toggle(service.id);
            }}
            hitSlop={8}
          >
            <Heart
              size={16}
              color={isFavorite ? HEART_COLOR : '#fff'}
              fill={isFavorite ? HEART_COLOR : 'transparent'}
            />
          </Pressable>
        )}
        {/* Provider avatar overlapping */}
        {provider && (
          <View style={styles.avatarOverlap}>
            <Avatar
              source={provider.avatar ? { uri: provider.avatar } : undefined}
              name={provider.name}
              size={40}
              online={provider.online}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text variant="body" weight="semibold" numberOfLines={1} style={styles.title}>
          {service.title}
        </Text>

        {/* Provider name + verified */}
        {provider && (
          <View style={styles.providerRow}>
            {provider.verified && (
              <Badge label="موثّق" variant="primary" style={styles.verifiedBadge} />
            )}
            <Text variant="caption" style={styles.providerName}>{provider.name}</Text>
          </View>
        )}

        {/* Price + distance */}
        <View style={styles.metaRow}>
          <View style={styles.distanceRow}>
            <MapPin size={12} color={MUTED} />
            <Text variant="caption" style={styles.distanceText}>{service.distance} كم</Text>
          </View>
          <Badge
            label={`${service.priceFrom ? 'ابتداءً من ' : ''}${service.price.toLocaleString('ar-DZ')} د.ج`}
            variant="primary"
          />
        </View>

        {/* Rating */}
        <StarRating
          value={service.rating}
          size={14}
          showCount
          count={service.reviewCount}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 12,
  },
  pressed: { opacity: 0.92 },
  featured: {
    borderTopWidth: 3,
    borderTopColor: PRIMARY,
  },

  imageWrapper: { position: 'relative' },
  image: { width: '100%', aspectRatio: 16 / 9 },
  heartBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOverlap: {
    position: 'absolute',
    bottom: -20,
    right: 12,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 22,
    zIndex: 1,
  },

  content: { padding: 16, paddingTop: 24, gap: 6 },
  title: { fontSize: 17, color: 'hsl(199, 41%, 12%)', textAlign: 'right' },

  providerRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  providerName: { color: MUTED, textAlign: 'right' },
  verifiedBadge: { transform: [{ scale: 0.85 }] },

  metaRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  distanceRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  distanceText: { color: MUTED },
});
