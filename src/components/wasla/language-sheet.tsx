import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import type { Language } from '@/lib/i18n/resources';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';
import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useSelectedLanguage } from '@/lib/i18n';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';

const LANGUAGES: { key: Language; i18nKey: string; native: string }[] = [
  { key: 'ar', i18nKey: 'profile.arabic', native: 'العربية' },
  { key: 'en', i18nKey: 'profile.english', native: 'English' },
  { key: 'fr', i18nKey: 'profile.french', native: 'Français' },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function LanguageSheet({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);
  const { language, setLanguage } = useSelectedLanguage();
  const current = (language ?? 'ar') as Language;

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.present();
    }
    else {
      sheetRef.current?.dismiss();
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (lang: Language) => {
      // Picking the active language is a no-op; just close. Otherwise
      // setLanguage persists the choice, flips RTL/LTR, and restarts the app,
      // so there is no need to manually dismiss the sheet.
      if (lang === current) {
        onClose();
        return;
      }
      setLanguage(lang);
    },
    [current, setLanguage, onClose],
  );

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
      enableDynamicSizing
      onDismiss={onClose}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheet}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.headerBlock}>
          <Text variant="heading" weight="semibold" style={styles.title}>
            {t('profile.language')}
          </Text>
        </View>

        <View style={styles.section}>
          {LANGUAGES.map((l) => {
            const selected = current === l.key;
            return (
              <Pressable
                key={l.key}
                style={[styles.row, selected && styles.rowActive]}
                onPress={() => handleSelect(l.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <View style={styles.rowLabelWrap}>
                  <Text variant="body" weight="medium" style={styles.rowLabel}>
                    {t(l.i18nKey)}
                  </Text>
                  <Text variant="caption" style={styles.rowNative}>
                    {l.native}
                  </Text>
                </View>
                {selected ? <Check size={22} color={PRIMARY} strokeWidth={2.4} /> : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: { backgroundColor: '#fff', borderRadius: 20 },
  handle: { backgroundColor: BORDER, width: 40 },
  container: { paddingHorizontal: 20, paddingTop: 12, gap: 16 },

  headerBlock: { gap: 4 },
  title: { textAlign: 'center', fontSize: 18 },

  section: { gap: 10 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  rowActive: {
    borderColor: PRIMARY,
    backgroundColor: 'hsl(258, 45%, 96%)',
  },
  rowLabelWrap: { gap: 2 },
  rowLabel: { color: DARK, textAlign: 'auto' },
  rowNative: { color: MUTED, textAlign: 'auto' },
});
