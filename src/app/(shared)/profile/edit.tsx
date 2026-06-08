import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { ChevronBack } from '@/components/ui/directional-icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/features/auth/use-auth-store';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useAuthStore.use.profile();
  const updateProfile = useAuthStore.use.updateProfile();

  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('editProfile.name_required'));
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
          <ChevronBack size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          {t('editProfile.title')}
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
            <Pressable style={styles.cameraBadge} onPress={() => Alert.alert(t('common.coming_soon'), t('editProfile.photo_upload_soon'))}>
              <Camera size={16} color="#fff" />
            </Pressable>
          </View>
          <Text variant="caption" style={styles.changePhotoLabel}>{t('editProfile.change_photo')}</Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Input
            label={t('editProfile.full_name')}
            value={name}
            onChangeText={setName}
            placeholder={t('editProfile.full_name_placeholder')}
            returnKeyType="next"
          />

          {/* Phone — read-only with verified badge */}
          <View style={styles.phoneRow}>
            <Text variant="caption" weight="medium" style={styles.phoneLabel}>{t('editProfile.phone')}</Text>
            <View style={styles.phoneField}>
              <Badge label={t('editProfile.verified')} variant="success" />
              <Text variant="body" style={styles.phoneValue}>
                {profile?.phone ?? '—'}
              </Text>
            </View>
            <Text variant="caption" style={styles.phoneNote}>
              {t('editProfile.phone_note')}
            </Text>
          </View>

          <Input
            label={t('editProfile.email')}
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
          label={t('editProfile.save')}
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
    flexDirection: rowDirection,
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
  phoneLabel: { color: MUTED, textAlign: textAlignStart },
  phoneField: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    backgroundColor: 'hsl(200, 20%, 97%)',
  },
  phoneValue: { color: MUTED, textAlign: textAlignStart, flex: 1 },
  phoneNote: { color: MUTED, textAlign: textAlignStart, fontSize: 12 },

  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  saveBtn: { width: '100%' },
});
