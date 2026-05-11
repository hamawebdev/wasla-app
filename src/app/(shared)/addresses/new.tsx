import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAddAddress } from '@/api/services/use-addresses';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

type LabelType = 'home' | 'work' | 'other';

const LABEL_OPTIONS: { id: LabelType; text: string }[] = [
  { id: 'home', text: 'المنزل' },
  { id: 'work', text: 'العمل' },
  { id: 'other', text: 'آخر' },
];

export default function NewAddressScreen() {
  const router = useRouter();
  const addAddress = useAddAddress();

  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<LabelType>('home');

  const handleSave = () => {
    if (!fullAddress.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال العنوان');
      return;
    }
    addAddress.mutate(
      {
        label: selectedLabel,
        labelText: LABEL_OPTIONS.find((l) => l.id === selectedLabel)?.text ?? '',
        fullAddress: fullAddress.trim(),
        city: city.trim() || 'الجزائر العاصمة',
        // TODO: replace with real coordinates from map picker
        lat: 36.7538 + Math.random() * 0.05,
        lng: 3.0588 + Math.random() * 0.05,
        isDefault: false,
        notes: notes.trim() || undefined,
      },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronRight size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          إضافة عنوان جديد
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Map placeholder — TODO: replace with react-native-maps MapView */}
        <View style={styles.mapPlaceholder}>
          <Image
            source={{ uri: 'https://picsum.photos/seed/map/800/400' }}
            style={styles.mapImage}
            resizeMode="cover"
          />
          <View style={styles.mapOverlay}>
            <Text variant="caption" style={styles.mapLabel}>
              اضغطي لتحديد موقعك على الخريطة (قريباً)
            </Text>
          </View>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <Input
            label="العنوان التفصيلي"
            value={fullAddress}
            onChangeText={setFullAddress}
            placeholder="مثال: حي الأمير عبد القادر، شارع 8 مايو"
          />
          <Input
            label="المدينة"
            value={city}
            onChangeText={setCity}
            placeholder="مثال: الجزائر العاصمة"
          />
          <Input
            label="ملاحظات إضافية (اختياري)"
            value={notes}
            onChangeText={setNotes}
            placeholder="مثال: الطابق الثالث، الشقة رقم 12"
          />

          {/* Label selector */}
          <View style={styles.labelSection}>
            <Text variant="caption" weight="medium" style={styles.labelTitle}>
              نوع العنوان
            </Text>
            <View style={styles.chipRow}>
              {LABEL_OPTIONS.map((opt) => (
                <Chip
                  key={opt.id}
                  label={opt.text}
                  selected={selectedLabel === opt.id}
                  onPress={() => setSelectedLabel(opt.id)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="حفظ العنوان"
          variant="primary"
          size="lg"
          loading={addAddress.isPending}
          onPress={handleSave}
          style={styles.saveBtn}
        />
      </View>
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
  backBtn: { padding: 4 },
  appBarTitle: { color: FOREGROUND, fontSize: 18 },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  mapPlaceholder: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: { width: '100%', height: '100%' },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  mapLabel: { color: '#fff', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  labelSection: { gap: 10 },
  labelTitle: { color: 'hsl(198, 15%, 45%)', textAlign: 'right' },
  chipRow: { flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  saveBtn: { width: '100%' },
});
