import { useRouter } from 'expo-router';
import { Heart, HeartOff } from 'lucide-react-native';
import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { StarRating } from '@/components/ui/star-rating';
import { Text } from '@/components/ui/text';
import { useFavorites, useToggleFavorite } from '@/api/services/use-favorites';
import { MOCK_SERVICES } from '@/api/fixtures/services';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';
const HEART_COLOR = 'hsl(0, 84%, 60%)';

function FavoriteCard({
  serviceId,
  onPress,
  onUnfavorite,
}: {
  serviceId: string;
  onPress: () => void;
  onUnfavorite: () => void;
}) {
  const service = MOCK_SERVICES.find((s) => s.id === serviceId);
  if (!service) return null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: service.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        <Pressable style={styles.heartBtn} onPress={onUnfavorite} hitSlop={8}>
          <Heart size={18} color={HEART_COLOR} fill={HEART_COLOR} />
        </Pressable>
      </View>
      <View style={styles.cardBody}>
        <Text variant="label" weight="semibold" numberOfLines={2} style={styles.title}>
          {service.title}
        </Text>
        <StarRating value={service.rating} size={12} />
        <Badge
          label={`${service.priceFrom ? 'ابتداءً من ' : ''}${service.price.toLocaleString('ar-DZ')} د.ج`}
          variant="primary"
        />
      </View>
    </Pressable>
  );
}

export default function FavoritesScreen() {
  const router = useRouter();
  const favoriteIds = useFavorites();
  const toggle = useToggleFavorite();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <View style={{ width: 40 }} />
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          المفضلة
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {favoriteIds.length === 0 ? (
        <EmptyState
          illustration={<HeartOff size={64} color="hsl(198, 21%, 88%)" />}
          title="لم تحفظي أي خدمة بعد"
          body="اضغطي على أيقونة القلب في أي خدمة لحفظها هنا"
          cta={{
            label: 'استكشفي الخدمات',
            onPress: () => router.push('/(customer)/'),
            variant: 'secondary',
          }}
        />
      ) : (
        <FlatList
          data={favoriteIds}
          numColumns={2}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FavoriteCard
              serviceId={item}
              onPress={() => router.push(`/(customer)/service/${item}`)}
              onUnfavorite={() => toggle(item)}
            />
          )}
        />
      )}
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
  appBarTitle: { color: FOREGROUND, fontSize: 18 },
  list: { padding: 12, gap: 12 },
  row: { gap: 12, flexDirection: 'row-reverse' },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  imageWrapper: { position: 'relative' },
  image: { width: '100%', aspectRatio: 4 / 3 },
  heartBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBody: { padding: 10, gap: 6 },
  title: { color: FOREGROUND, textAlign: 'right' },
});
