import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronLeft,
  Eye,
  HelpCircle,
  Languages,
  LogOut,
  MapPin,
  Star,
  User,
  Wallet,
  Zap,
} from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/use-auth-store';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';
const DESTRUCTIVE = 'hsl(0, 84%, 60%)';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export default function ProviderProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);

  const handleSignOut = () => {
    signOut();
    router.replace('/role-select' as any);
    showMessage({ message: 'تم تسجيل الخروج', type: 'info' });
  };

  const menuItems: MenuItem[] = [
    {
      icon: <User size={20} color={PRIMARY} />,
      label: t('profile.edit_profile'),
      onPress: () => router.push('/(shared)/profile/edit'),
    },
    {
      icon: <Eye size={20} color={PRIMARY} />,
      label: 'معاينة كعميل',
      onPress: () => router.push('/(provider)/profile/preview'),
    },
    {
      icon: <Bell size={20} color={PRIMARY} />,
      label: t('profile.notifications'),
      onPress: () => router.push('/(shared)/notifications'),
    },
    {
      icon: <MapPin size={20} color={PRIMARY} />,
      label: t('profile.addresses'),
      onPress: () => router.push('/(shared)/addresses'),
    },
    {
      icon: <Wallet size={20} color={PRIMARY} />,
      label: 'المحفظة',
      onPress: () => router.push('/(shared)/wallet'),
    },
    {
      icon: <Star size={20} color={PRIMARY} />,
      label: 'تقييماتي',
      onPress: () => {},
    },
    {
      icon: <Zap size={20} color={PRIMARY} />,
      label: t('provider.promote_title'),
      onPress: () => router.push('/(provider)/promote'),
    },
    {
      icon: <Languages size={20} color={PRIMARY} />,
      label: t('profile.language'),
      onPress: () => {},
    },
    {
      icon: <HelpCircle size={20} color={PRIMARY} />,
      label: t('profile.help'),
      onPress: () => router.push('/(shared)/help'),
    },
    {
      icon: <LogOut size={20} color={DESTRUCTIVE} />,
      label: t('profile.logout'),
      onPress: handleSignOut,
      destructive: true,
    },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Provider banner */}
        <View style={styles.providerBanner}>
          <Avatar name="أم رشيد" size={80} online />
          <View style={styles.providerInfo}>
            <Text variant="heading" weight="semibold" style={styles.providerName}>
              أم رشيد
            </Text>
            <Badge label={t('profile.role_provider')} variant="primary" />
            <View style={styles.providerStats}>
              <View style={styles.stat}>
                <Text variant="label" weight="semibold" style={{ color: '#fff' }}>4.9</Text>
                <Text variant="caption" style={{ color: 'rgba(255,255,255,0.75)' }}>تقييم</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text variant="label" weight="semibold" style={{ color: '#fff' }}>87</Text>
                <Text variant="caption" style={{ color: 'rgba(255,255,255,0.75)' }}>تقييم</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text variant="label" weight="semibold" style={{ color: '#fff' }}>3</Text>
                <Text variant="caption" style={{ color: 'rgba(255,255,255,0.75)' }}>خدمات</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Points row */}
        <Pressable style={styles.pointsRow}>
          <Text variant="caption" style={{ color: MUTED }}>نقاطي</Text>
          <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>350 نقطة</Text>
        </Pressable>

        {/* Edit profile */}
        <Pressable style={styles.editBtn} onPress={() => router.push('/(shared)/profile/edit')}>
          <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>
            {t('profile.edit_profile')}
          </Text>
        </Pressable>

        {/* Menu */}
        <View style={styles.menu}>
          {menuItems.map((item, i) => (
            <Pressable
              key={i}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={item.onPress}
            >
              <ChevronLeft size={16} color={item.destructive ? DESTRUCTIVE : MUTED} style={{ transform: [{ scaleX: -1 }] }} />
              <Text variant="body" style={[styles.menuLabel, item.destructive && { color: DESTRUCTIVE }]}>
                {item.label}
              </Text>
              <View style={styles.menuIcon}>{item.icon}</View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'hsl(180, 25%, 98%)' },
  providerBanner: {
    backgroundColor: PRIMARY,
    padding: 24,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  providerInfo: { flex: 1, gap: 8, alignItems: 'flex-end' },
  providerName: { color: '#fff', textAlign: 'right', fontSize: 20 },
  providerStats: { flexDirection: 'row-reverse', alignItems: 'center', gap: 16 },
  stat: { alignItems: 'center', gap: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.3)' },
  pointsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  editBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'hsl(258, 45%, 97%)',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    marginTop: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: BORDER },
  menuIcon: { width: 28, alignItems: 'center' },
  menuLabel: { flex: 1, textAlign: 'right', color: DARK },
});
