import { useRouter } from 'expo-router';
import {
  BookOpen, Camera, Cake, ChefHat, MonitorSmartphone, Package, PartyPopper,
  Scissors, Smartphone, Sparkles, Star, Wrench,
} from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { setSetupComplete } from '@/features/auth/use-auth-store';
import { CATEGORIES } from '@/api/fixtures/categories';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const TOTAL_STEPS = 3;

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Scissors, Cake, Wrench, Smartphone, PartyPopper, MonitorSmartphone,
  Sparkles, Star, ChefHat, BookOpen, Camera, Package,
};

export default function ProviderSetupScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [radius, setRadius] = useState(10);

  const handleFinish = async () => {
    setSetupComplete();
    router.replace('/(provider)/');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text variant="heading" weight="semibold">{t('auth.setup_title')}</Text>
        {/* Dot stepper */}
        <View style={styles.stepper}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <View key={i} style={[styles.dot, i + 1 === step && styles.dotActive, i + 1 < step && styles.dotDone]} />
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {step === 1 && (
          <Step1
            projectName={projectName}
            setProjectName={setProjectName}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            t={t}
          />
        )}
        {step === 2 && <Step2 t={t} />}
        {step === 3 && (
          <Step3 radius={radius} setRadius={setRadius} t={t} />
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step < TOTAL_STEPS ? (
          <Button
            variant="primary"
            label={t('common.next')}
            onPress={() => setStep((s) => s + 1)}
            disabled={step === 1 && (!projectName.trim() || !selectedCategory)}
          />
        ) : (
          <Button
            variant="primary"
            label={t('auth.finish')}
            onPress={handleFinish}
          />
        )}
        {step > 1 && (
          <Button
            variant="ghost"
            label={t('common.back')}
            onPress={() => setStep((s) => s - 1)}
          />
        )}
      </View>
    </Screen>
  );
}

function Step1({ projectName, setProjectName, selectedCategory, setSelectedCategory, t }: {
  projectName: string; setProjectName: (v: string) => void;
  selectedCategory: string; setSelectedCategory: (v: string) => void;
  t: (k: string) => string;
}) {
  return (
    <View style={styles.stepContent}>
      <Input
        label={t('auth.project_name')}
        placeholder={t('auth.project_name_placeholder')}
        value={projectName}
        onChangeText={setProjectName}
      />
      <Text variant="label" weight="medium" style={styles.categoryLabel}>{t('auth.category')}</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon];
          const isSelected = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              {IconComponent && (
                <IconComponent size={24} color={isSelected ? PRIMARY : MUTED} />
              )}
              <Text variant="caption" style={[styles.categoryItemLabel, isSelected && styles.categoryItemLabelSelected]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Step2({ t }: { t: (k: string) => string }) {
  return (
    <View style={styles.stepContent}>
      <Card style={styles.uploadArea}>
        <Camera size={40} color={MUTED} />
        <Text variant="body" style={{ color: MUTED, textAlign: 'center' }}>{t('auth.add_photos')}</Text>
      </Card>
      <Text variant="caption" style={{ color: MUTED, textAlign: 'center' }}>
        يمكنكِ إضافة حتى 5 صور من أعمالكِ
      </Text>
    </View>
  );
}

function Step3({ radius, setRadius, t }: { radius: number; setRadius: (v: number) => void; t: (k: string) => string }) {
  return (
    <View style={styles.stepContent}>
      <Text variant="label" weight="medium" style={styles.categoryLabel}>{t('auth.service_area')}</Text>
      <Card style={styles.mapPlaceholder}>
        <View style={styles.mapPin} />
        <Text variant="caption" style={{ color: MUTED, textAlign: 'center' }}>
          موقعكِ الحالي
        </Text>
      </Card>
      <View style={styles.radiusRow}>
        <Text variant="label" style={{ color: MUTED }}>1 كم</Text>
        <Text variant="body" weight="semibold" style={{ color: PRIMARY }}>{radius} كم</Text>
        <Text variant="label" style={{ color: MUTED }}>50 كم</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 24, gap: 16, alignItems: 'center' },
  stepper: { flexDirection: 'row', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'hsl(200, 20%, 88%)' },
  dotActive: { backgroundColor: PRIMARY, width: 24 },
  dotDone: { backgroundColor: 'hsl(258, 52%, 80%)' },

  scrollContent: { padding: 24 },
  stepContent: { gap: 16 },

  categoryLabel: { textAlign: 'right', color: 'hsl(199, 41%, 12%)', marginBottom: -4 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'hsl(200, 20%, 96%)',
    gap: 6,
    minHeight: 80,
  },
  categoryItemSelected: { backgroundColor: 'hsl(258, 45%, 96%)', borderWidth: 1.5, borderColor: PRIMARY },
  categoryItemLabel: { fontSize: 11, textAlign: 'center', color: MUTED, fontFamily: 'Rubik' },
  categoryItemLabelSelected: { color: PRIMARY },

  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'hsl(198, 21%, 88%)',
    backgroundColor: 'transparent',
    gap: 12,
  },
  mapPlaceholder: {
    minHeight: 200,
    backgroundColor: 'hsl(180, 20%, 94%)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    marginBottom: 4,
  },
  radiusRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  footer: { padding: 24, gap: 8 },
});
