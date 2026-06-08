import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { HandshakeIllustration } from '@/components/illustrations';
import { PROVIDER_NAMES } from '@/api/fixtures/bookings';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';

const EMOJI_MAP: Record<number, string> = {
  1: '😕',
  2: '🙁',
  3: '😐',
  4: '😊',
  5: '🤩',
};

const MOCK_BOOKING_PROVIDERS: Record<string, string> = {
  b1: 'p1',
  b2: 'p3',
  b3: 'p5',
  b4: 'p8',
};

export default function ReviewScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { t } = useTranslation();
  const router = useRouter();

  const providerId = MOCK_BOOKING_PROVIDERS[bookingId ?? ''] ?? 'p1';
  const providerName = PROVIDER_NAMES[providerId] ?? t('profile.role_provider');

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handleSubmit = () => {
    if (rating === 0) {
      showMessage({ message: t('review.select_rating_first'), type: 'warning' });
      return;
    }
    showMessage({
      message: t('loyalty.points_earned', { count: 5 }),
      description: rating >= 4 ? t('review.rating_high') : t('review.rating_low'),
      type: 'success',
      duration: 3000,
    });
    router.back();
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <HandshakeIllustration size={120} />
        </View>

        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('review.title')}
        </Text>
        <Text variant="body" style={styles.question}>
          {t('review.question', { name: providerName })}
        </Text>

        {/* Emoji reaction */}
        {rating > 0 && (
          <Text style={styles.emoji}>{EMOJI_MAP[rating]}</Text>
        )}

        {/* Star row */}
        <View style={styles.starsRow}>
          {[5, 4, 3, 2, 1].map((star) => (
            <Pressable key={star} onPress={() => setRating(star)} hitSlop={8}>
              <Text style={[styles.star, rating >= star && styles.starFilled]}>★</Text>
            </Pressable>
          ))}
        </View>

        {/* Comment textarea */}
        <View style={styles.textareaWrap}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder={t('review.details_placeholder')}
            placeholderTextColor={MUTED}
            multiline
            numberOfLines={4}
            textAlign={textAlignStart}
            style={styles.textarea}
          />
        </View>

        {/* Photo upload row */}
        <View style={styles.photosRow}>
          {photos.map((_, i) => (
            <View key={i} style={styles.photoSlot}>
              <Camera size={20} color={MUTED} />
            </View>
          ))}
          {photos.length < 3 && (
            <Pressable
              style={[styles.photoSlot, styles.photoAdd]}
              onPress={() => setPhotos((p) => [...p, `p${p.length}`])}
            >
              <Camera size={20} color={PRIMARY} />
              <Text variant="caption" style={{ color: PRIMARY, fontSize: 11 }}>
                {t('review.add_photo')}
              </Text>
            </Pressable>
          )}
        </View>

        <Button
          variant="primary"
          label={t('review.submit')}
          onPress={handleSubmit}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16, alignItems: 'center' },
  illustrationWrap: { paddingVertical: 8 },
  title: { textAlign: 'center', fontSize: 22, color: DARK },
  question: { textAlign: 'center', color: MUTED, lineHeight: 24, maxWidth: 280 },
  emoji: { fontSize: 48 },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  star: { fontSize: 36, color: 'hsl(198, 21%, 88%)' },
  starFilled: { color: 'hsl(38, 92%, 50%)' },
  textareaWrap: { width: '100%' },
  textarea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    fontFamily: 'Rubik',
    fontSize: 15,
    color: DARK,
    minHeight: 100,
    textAlignVertical: 'top',
    width: '100%',
  },
  photosRow: {
    flexDirection: rowDirection,
    gap: 10,
    width: '100%',
  },
  photoSlot: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: 'hsl(200, 20%, 94%)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoAdd: {
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderStyle: 'dashed',
    backgroundColor: 'hsl(258, 45%, 97%)',
  },
});
