import { useRouter } from 'expo-router';
import { Camera, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/features/auth/use-auth-store';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

export default function EditProfileScreen() {
  const router = useRouter();
  const profile = useAuthStore.use.profile();
  const updateProfile = useAuthStore.use.updateProfile();

  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('خطأ', 'الاسم الكامل مطلوب');
      return;
    }
    setSaving(true);
    // TODO: integrate with real API
    await new Promise((r) => setTimeout(r, 600));
    updateProfile({ name: name.trim(), email: email.trim() || undefined });
    setSaving(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronRight size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          تعديل الملف الشخصي
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar upload section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Avatar
              source={profile?.avatar ? { uri: profile.avatar } : undefined}
              name={profile?.name}
              size={90}
            />
            {/* TODO: Integrate real image picker (expo-image-picker) */}
            <Pressable style={styles.cameraBadge} onPress={() => Alert.alert('قريباً', 'سيتوفر رفع الصورة في تحديث قادم')}>
              <Camera size={16} color="#fff" />
            </Pressable>
          </View>
          <Text variant="caption" style={styles.changePhotoLabel}>تغيير الصورة</Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Input
            label="الاسم الكامل"
            value={name}
            onChangeText={setName}
            placeholder="أدخلي اسمك الكامل"
            returnKeyType="next"
          />

          {/* Phone — read-only with verified badge */}
          <View style={styles.phoneRow}>
            <Text variant="caption" weight="medium" style={styles.phoneLabel}>رقم الهاتف</Text>
            <View style={styles.phoneField}>
              <Badge label="موثّق ✓" variant="success" />
              <Text variant="body" style={styles.phoneValue}>
                {profile?.phone ?? '—'}
              </Text>
            </View>
            <Text variant="caption" style={styles.phoneNote}>
              لتغيير رقم الهاتف تواصلي مع الدعم
            </Text>
          </View>

          <Input
            label="البريد الإلكتروني"
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </ScrollView>

      {/* Sticky save button */}
      <View style={styles.footer}>
        <Button
          label="حفظ التغييرات"
          variant="primary"
          size="lg"
          loading={saving}
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

  avatarSection: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  avatarWrapper: { position: 'relative' },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changePhotoLabel: { color: PRIMARY, fontWeight: '500' },

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

  phoneRow: { gap: 6 },
  phoneLabel: { color: MUTED, textAlign: 'right' },
  phoneField: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    backgroundColor: 'hsl(200, 20%, 97%)',
  },
  phoneValue: { color: MUTED, textAlign: 'right', flex: 1 },
  phoneNote: { color: MUTED, textAlign: 'right', fontSize: 12 },

  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  saveBtn: { width: '100%' },
});
