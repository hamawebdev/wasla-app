import { useRouter } from 'expo-router';
import {
  Bell,
  BookOpen,
  ChevronLeft,
  Gift,
  Heart,
  HelpCircle,
  Languages,
  LogOut,
  MapPin,
  User,
  Wallet,
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
import { MOCK_USER_POINTS } from '@/api/fixtures/loyalty';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';
const DESTRUCTIVE = 'hsl(0, 84%, 60%)';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onPress: () => void;
  destructive?: boolean;
}

export default function CustomerProfileScreen() {
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
      icon: <BookOpen size={20} color={PRIMARY} />,
      label: t('profile.my_bookings'),
      onPress: () => router.push('/(customer)/bookings'),
    },
    {
      icon: <Heart size={20} color={PRIMARY} />,
      label: 'المفضلة',
      onPress: () => router.push('/(customer)/favorites'),
    },
    {
      icon: <Gift size={20} color={PRIMARY} />,
      label: t('loyalty.title'),
      badge: `${MOCK_USER_POINTS} نقطة`,
      onPress: () => router.push('/(customer)/loyalty'),
    },
    {
      icon: <MapPin size={20} color={PRIMARY} />,
      label: t('profile.addresses'),
      onPress: () => router.push('/(shared)/addresses'),
    },
    {
      icon: <Wallet size={20} color={PRIMARY} />,
      label: 'مدفوعاتي والمحفظة',
      onPress: () => router.push('/(shared)/wallet'),
    },
    {
      icon: <Bell size={20} color={PRIMARY} />,
      label: t('profile.notifications'),
      onPress: () => router.push('/(shared)/notifications'),
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
        {/* Avatar & name */}
        <View style={styles.profileHeader}>
          <Avatar name="أميرة بن علي" size={80} />
          <Text variant="heading" weight="semibold" style={styles.name}>
            أميرة بن علي
          </Text>
          <Badge label={t('profile.role_customer')} variant="accent" />
        </View>

        {/* Points strip */}
        <Pressable
          style={styles.pointsStrip}
          onPress={() => router.push('/(customer)/loyalty')}
        >
          <ChevronLeft size={16} color={PRIMARY} style={{ transform: [{ scaleX: -1 }] }} />
          <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>
            {MOCK_USER_POINTS} نقطة — الفضية
          </Text>
          <Text variant="caption" style={{ color: MUTED }}>نقاطي</Text>
        </Pressable>

        {/* Edit profile btn */}
        <Pressable style={styles.editBtn} onPress={() => router.push('/(shared)/profile/edit')}>
          <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>
            {t('profile.edit_profile')}
          </Text>
        </Pressable>

        {/* Menu items */}
        <View style={styles.menu}>
          {menuItems.map((item, i) => (
            <Pressable
              key={i}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={item.onPress}
            >
              <ChevronLeft
                size={16}
                color={item.destructive ? DESTRUCTIVE : MUTED}
                style={{ transform: [{ scaleX: -1 }] }}
              />
              {item.badge && (
                <Text variant="caption" style={styles.menuBadge}>{item.badge}</Text>
              )}
              <Text
                variant="body"
                style={[styles.menuLabel, item.destructive && { color: DESTRUCTIVE }]}
              >
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  name: { color: DARK, textAlign: 'center', fontSize: 22 },
  pointsStrip: {
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
    marginBottom: 20,
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
  menuBadge: { color: PRIMARY, fontSize: 12 },
});
