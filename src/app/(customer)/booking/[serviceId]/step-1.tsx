import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { BookingStepper } from '@/components/wasla/booking-stepper';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';

const MONTH_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const WEEKDAY_KEYS = [
  'days.narrow_mon',
  'days.narrow_tue',
  'days.narrow_wed',
  'days.narrow_thu',
  'days.narrow_fri',
  'days.narrow_sat',
  'days.narrow_sun',
];

export default function BookingStep1() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const today = new Date().getDate();

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <View style={styles.container}>
        <BookingStepper currentStep={1} />
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('booking.select_date')}
        </Text>

        {/* Mini calendar */}
        <Card style={styles.calendarCard}>
          <Text variant="label" weight="semibold" style={styles.monthLabel}>{t('booking.calendar_month')}</Text>
          <View style={styles.weekdayRow}>
            {WEEKDAY_KEYS.map((d) => (
              <Text key={d} variant="caption" style={styles.weekday}>{t(d)}</Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {MONTH_DAYS.map((day) => {
              const isPast = day < today;
              const isSelected = selectedDay === day;
              return (
                <Pressable
                  key={day}
                  onPress={() => !isPast && setSelectedDay(day)}
                  style={[
                    styles.dayBtn,
                    !isPast && styles.dayAvailable,
                    isSelected && styles.daySelected,
                    isPast && styles.dayPast,
                  ]}
                >
                  <Text
                    variant="caption"
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      isPast && styles.dayTextPast,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Time slots */}
        <Text variant="label" weight="medium" style={styles.sectionLabel}>
          {t('booking.select_time')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.timeRow}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <Pressable
                  key={slot}
                  onPress={() => setSelectedTime(slot)}
                  style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                >
                  <Text
                    variant="label"
                    style={[styles.timeText, isSelected && styles.timeTextSelected]}
                  >
                    {slot}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <Button
          variant="primary"
          label={t('common.next')}
          onPress={() => router.push(`/(customer)/booking/${serviceId}/step-2`)}
          disabled={!selectedDay || !selectedTime}
          style={{ marginTop: 8 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  title: { textAlign: 'center', fontSize: 22 },

  calendarCard: { gap: 12 },
  monthLabel: { textAlign: 'center', color: 'hsl(199, 41%, 12%)', fontSize: 16 },

  weekdayRow: { flexDirection: rowDirection, justifyContent: 'space-around' },
  weekday: { color: MUTED, textAlign: 'center', width: 32 },

  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'flex-end' },
  dayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayAvailable: { backgroundColor: 'hsl(258, 45%, 96%)' },
  daySelected: { backgroundColor: PRIMARY },
  dayPast: { backgroundColor: 'transparent' },
  dayText: { color: 'hsl(258, 52%, 35%)', fontFamily: 'Rubik', fontSize: 13 },
  dayTextSelected: { color: '#fff', fontWeight: '600' },
  dayTextPast: { color: MUTED },

  sectionLabel: { textAlign: textAlignStart, color: 'hsl(199, 41%, 12%)' },
  timeRow: { flexDirection: rowDirection, gap: 10, paddingVertical: 4 },
  timeSlot: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'hsl(198, 21%, 88%)',
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotSelected: { borderColor: PRIMARY, backgroundColor: 'hsl(258, 45%, 96%)' },
  timeText: { color: MUTED, fontFamily: 'Rubik' },
  timeTextSelected: { color: PRIMARY, fontWeight: '600' },
});
