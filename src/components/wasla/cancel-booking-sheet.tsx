import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';

export type CancelReason =
  | 'changed'
  | 'provider'
  | 'alternative'
  | 'price'
  | 'other';

const REASONS: { key: CancelReason; i18nKey: string }[] = [
  { key: 'changed', i18nKey: 'booking.cancel_reason_changed' },
  { key: 'provider', i18nKey: 'booking.cancel_reason_provider' },
  { key: 'alternative', i18nKey: 'booking.cancel_reason_alternative' },
  { key: 'price', i18nKey: 'booking.cancel_reason_price' },
  { key: 'other', i18nKey: 'booking.cancel_reason_other' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: CancelReason, notes?: string) => void;
}

export function CancelBookingSheet({ isOpen, onClose, onConfirm }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [reason, setReason] = useState<CancelReason | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason(null);
      setNotes('');
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    if (!reason) return;
    onConfirm(reason, notes.trim() || undefined);
  }, [reason, notes, onConfirm]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={['75%']}
      onDismiss={onClose}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheet}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.headerBlock}>
          <Text variant="heading" weight="semibold" style={styles.title}>
            {t('booking.cancel_title')}
          </Text>
          <Text variant="caption" style={styles.subtitle}>
            {t('booking.cancel_subtitle')}
          </Text>
        </View>

        <BottomSheetScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            {REASONS.map((r) => {
              const selected = reason === r.key;
              return (
                <Pressable
                  key={r.key}
                  style={[styles.radioRow, selected && styles.radioRowActive]}
                  onPress={() => setReason(r.key)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <View style={[styles.radio, selected && styles.radioActive]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                  <Text variant="body" style={styles.radioLabel}>
                    {t(r.i18nKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text variant="label" weight="medium" style={styles.notesLabel}>
              {t('booking.cancel_notes_label')}
            </Text>
            <BottomSheetTextInput
              style={styles.notesInput}
              placeholder={t('booking.cancel_notes_placeholder')}
              placeholderTextColor={MUTED}
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlign="right"
              textAlignVertical="top"
            />
          </View>
        </BottomSheetScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Button
            variant="destructive"
            label={t('booking.cancel_confirm')}
            onPress={handleConfirm}
            disabled={!reason}
            style={{ flex: 1 }}
          />
          <Button
            variant="ghost"
            label={t('common.back')}
            onPress={onClose}
            style={{ flex: 1 }}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: { backgroundColor: '#fff', borderRadius: 20 },
  handle: { backgroundColor: BORDER, width: 40 },
  container: { flex: 1 },

  headerBlock: { paddingHorizontal: 20, paddingTop: 12, gap: 4 },
  title: { textAlign: 'center', fontSize: 18 },
  subtitle: { textAlign: 'center', color: MUTED },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, gap: 20 },

  section: { gap: 8 },

  radioRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  radioRowActive: {
    borderColor: PRIMARY,
    backgroundColor: 'hsl(258, 45%, 96%)',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: PRIMARY },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },
  radioLabel: { color: DARK, flex: 1, textAlign: 'right' },

  notesLabel: { textAlign: 'right', color: DARK },
  notesInput: {
    fontFamily: 'Rubik',
    fontSize: 15,
    color: DARK,
    minHeight: 96,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    writingDirection: 'rtl',
  },

  footer: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'hsl(198, 21%, 92%)',
    backgroundColor: '#fff',
  },
});
