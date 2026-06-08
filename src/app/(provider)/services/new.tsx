import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronBack } from '@/components/ui/directional-icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { CATEGORIES as MOCK_CATEGORIES } from '@/api/fixtures/categories';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';

const STEPS = [
  'provider.service_step1',
  'provider.service_step2',
  'provider.service_step3',
  'provider.service_step4',
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
const DAY_KEYS = [
  'days.monday',
  'days.tuesday',
  'days.wednesday',
  'days.thursday',
  'days.friday',
  'days.saturday',
  'days.sunday',
];

export default function NewServiceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Form state
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceMode, setPriceMode] = useState<'fixed' | 'from'>('fixed');
  const [photos, setPhotos] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<Set<string>>(new Set());
  const [availableTimes, setAvailableTimes] = useState<Set<string>>(new Set());

  const toggleDay = (day: string) =>
    setAvailableDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });

  const toggleTime = (t: string) =>
    setAvailableTimes((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      showMessage({
        message: t('provider.service_added_title'),
        description: t('provider.service_added_body'),
        type: 'success',
      });
      router.back();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else router.back();
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={8}>
          <ChevronBack size={24} color={DARK} />
        </Pressable>
        <Text variant="label" weight="semibold" style={{ color: DARK }}>
          {t('provider.add_service')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Stepper */}
      <View style={styles.stepper}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.stepDot, i <= step && styles.stepDotActive]} />
        ))}
      </View>
      <Text variant="label" weight="semibold" style={styles.stepTitle}>
        {t(STEPS[step])}
      </Text>

      <View style={styles.form}>
        {step === 0 && (
          <>
            <View>
              <Text variant="label" style={styles.fieldLabel}>{t('provider.field_service_name')}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('provider.service_name_placeholder')}
                placeholderTextColor={MUTED}
                textAlign={textAlignStart}
                style={styles.input}
              />
            </View>
            <View>
              <Text variant="label" style={styles.fieldLabel}>{t('search.category')}</Text>
              <View style={styles.categoryGrid}>
                {MOCK_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={[styles.catChip, categoryId === cat.id && styles.catChipSelected]}
                    onPress={() => setCategoryId(cat.id)}
                  >
                    <Text
                      variant="caption"
                      style={[styles.catLabel, categoryId === cat.id && styles.catLabelSelected]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <View>
              <Text variant="label" style={styles.fieldLabel}>{t('service.description')}</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t('provider.description_placeholder')}
                placeholderTextColor={MUTED}
                multiline
                numberOfLines={4}
                textAlign={textAlignStart}
                style={[styles.input, styles.textarea]}
              />
            </View>
            <View>
              <Text variant="label" style={styles.fieldLabel}>{`${t('service.price')} (${t('common.dzd')})`}</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                placeholderTextColor={MUTED}
                keyboardType="numeric"
                textAlign={textAlignStart}
                style={styles.input}
              />
            </View>
            <View style={styles.priceToggle}>
              {['fixed', 'from'].map((mode) => (
                <Pressable
                  key={mode}
                  style={[styles.priceBtn, priceMode === mode && styles.priceBtnActive]}
                  onPress={() => setPriceMode(mode as 'fixed' | 'from')}
                >
                  <Text
                    variant="label"
                    style={priceMode === mode ? { color: '#fff' } : { color: MUTED }}
                  >
                    {mode === 'fixed' ? t('provider.price_fixed') : t('provider.price_from')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 2 && (
          <View style={styles.photosGrid}>
            {photos.map((_, i) => (
              <View key={i} style={styles.photoSlot}>
                <Camera size={24} color={MUTED} />
              </View>
            ))}
            {photos.length < 5 && (
              <Pressable
                style={[styles.photoSlot, styles.photoAdd]}
                onPress={() => setPhotos((p) => [...p, `photo_${p.length}`])}
              >
                <Camera size={24} color={PRIMARY} />
                <Text variant="caption" style={{ color: PRIMARY }}>{t('tabs.add')}</Text>
              </Pressable>
            )}
            {photos.length === 0 && (
              <Text variant="caption" style={styles.photoHint}>
                {t('provider.photos_hint')}
              </Text>
            )}
          </View>
        )}

        {step === 3 && (
          <>
            <Text variant="label" style={styles.fieldLabel}>{t('provider.available_days')}</Text>
            <View style={styles.daysGrid}>
              {DAY_KEYS.map((dayKey) => (
                <Pressable
                  key={dayKey}
                  style={[styles.dayChip, availableDays.has(dayKey) && styles.dayChipActive]}
                  onPress={() => toggleDay(dayKey)}
                >
                  <Text
                    variant="caption"
                    style={availableDays.has(dayKey) ? { color: '#fff' } : { color: MUTED }}
                  >
                    {t(dayKey)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>{t('provider.working_hours')}</Text>
            <View style={styles.timeSlotsGrid}>
              {TIME_SLOTS.map((slot) => (
                <Pressable
                  key={slot}
                  style={[styles.timeSlot, availableTimes.has(slot) && styles.timeSlotActive]}
                  onPress={() => toggleTime(slot)}
                >
                  <Text
                    variant="caption"
                    style={availableTimes.has(slot) ? { color: '#fff' } : { color: MUTED }}
                  >
                    {slot}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          variant="primary"
          label={step === STEPS.length - 1 ? t('auth.finish') : t('common.next')}
          onPress={handleNext}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  stepper: {
    flexDirection: rowDirection,
    gap: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'hsl(198, 21%, 88%)',
  },
  stepDotActive: { backgroundColor: PRIMARY },
  stepTitle: {
    textAlign: 'center',
    color: DARK,
    fontSize: 16,
    marginBottom: 16,
  },
  form: { paddingHorizontal: 20, gap: 16 },
  fieldLabel: { textAlign: textAlignStart, color: DARK, marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    fontFamily: 'Rubik',
    fontSize: 15,
    color: DARK,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  categoryGrid: {
    flexDirection: rowDirection,
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  catChipSelected: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  catLabel: { color: MUTED },
  catLabelSelected: { color: '#fff' },
  priceToggle: {
    flexDirection: rowDirection,
    backgroundColor: 'hsl(200, 20%, 94%)',
    borderRadius: 10,
    padding: 4,
  },
  priceBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  priceBtnActive: { backgroundColor: PRIMARY },
  photosGrid: {
    flexDirection: rowDirection,
    flexWrap: 'wrap',
    gap: 10,
  },
  photoSlot: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: 'hsl(200, 20%, 94%)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoAdd: { borderWidth: 2, borderColor: PRIMARY, borderStyle: 'dashed', backgroundColor: 'hsl(258, 45%, 97%)' },
  photoHint: {
    flex: 1,
    textAlign: textAlignStart,
    color: MUTED,
    alignSelf: 'center',
    paddingStart: 12,
  },
  daysGrid: { flexDirection: rowDirection, flexWrap: 'wrap', gap: 8 },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  dayChipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  timeSlotsGrid: { flexDirection: rowDirection, flexWrap: 'wrap', gap: 8 },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  timeSlotActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  footer: { padding: 20, paddingTop: 8 },
});
