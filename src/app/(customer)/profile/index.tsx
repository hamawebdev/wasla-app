import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import {
  BadgeCheck,
  Bell,
  Camera,
  CalendarDays,
  Heart,
  HelpCircle,
  Languages,
  LogOut,
  MapPin,
  Moon,
  Sparkles,
  User,
  Wallet,
} from 'lucide-react-native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChevronForward } from '@/components/ui/directional-icon';
import { Text } from '@/components/ui/text';
import { LanguageSheet } from '@/components/wasla/language-sheet';
import { useAuthStore } from '@/features/auth/use-auth-store';
import { useSelectedLanguage } from '@/lib/i18n';
import { useSelectedTheme } from '@/lib/hooks/use-selected-theme';
import {
  MOCK_NEXT_TIER_NAME,
  MOCK_NEXT_TIER_POINTS,
  MOCK_TIER_NAME,
  MOCK_USER_POINTS,
} from '@/api/fixtures/loyalty';
import { formatNumber } from '@/lib/format';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const PRIMARY_DARK = 'hsl(258, 52%, 38%)';
const PRIMARY_SOFT = 'hsl(258, 45%, 96%)';
const PRIMARY_TINT = 'hsl(258, 45%, 92%)';
const ACCENT_GOLD = 'hsl(45, 90%, 60%)';
const SURFACE = 'hsl(180, 25%, 98%)';
const CARD = '#ffffff';
const DARK = 'hsl(199, 41%, 12%)';
const MUTED = 'hsl(198, 15%, 45%)';
const OUTLINE = 'hsl(198, 21%, 88%)';
const ERROR = 'hsl(0, 84%, 56%)';
const ERROR_SOFT = 'hsl(0, 84%, 96%)';

const LANGUAGE_LABELS: Record<string, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
};

const WALLET_BALANCE = '150 د.ج';
const APP_VERSION =
  (Constants?.expoConfig?.version as string | undefined) ?? '2.4.1';

const PROGRESS_PCT = (() => {
  const target = MOCK_USER_POINTS + MOCK_NEXT_TIER_POINTS;
  if (target <= 0) return 0;
  return Math.max(4, Math.min(100, (MOCK_USER_POINTS / target) * 100));
})();

export default function CustomerProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);
  const profile = useAuthStore.use.profile();
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();
  const { language } = useSelectedLanguage();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [langSheetOpen, setLangSheetOpen] = React.useState(false);
  const isDark = selectedTheme === 'dark';
  const currentLanguageLabel = LANGUAGE_LABELS[language ?? 'ar'] ?? LANGUAGE_LABELS.ar;

  const userName = profile?.name ?? 'أحمد بن علي';
  const userAvatar = profile?.avatar;

  const handleSignOut = () => {
    signOut();
    router.replace('/account-picker' as any);
    showMessage({ message: t('profile.logged_out'), type: 'info' });
  };

  const toggleDarkMode = (next: boolean) => {
    setSelectedTheme(next ? 'dark' : 'light');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text variant="heading" weight="bold" style={styles.avatarInitials}>
                  {getInitials(userName)}
                </Text>
              </View>
            )}
            <Pressable
              style={styles.cameraBtn}
              onPress={() => router.push('/(shared)/profile/edit')}
              hitSlop={8}
              accessibilityLabel={t('editProfile.change_photo')}
            >
              <Camera size={16} color="#fff" strokeWidth={2.2} />
            </Pressable>
          </View>

          <Text variant="heading" weight="semibold" style={styles.name}>
            {userName}
          </Text>

          <View style={styles.tierChip}>
            <BadgeCheck size={14} color={PRIMARY} fill={PRIMARY_TINT} strokeWidth={2.2} />
            <Text variant="label" weight="medium" style={styles.tierChipText}>
              {t('profile.premium_customer')}
            </Text>
          </View>
        </View>

        {/* Loyalty / Rewards Card */}
        <Pressable
          style={styles.pointsCard}
          onPress={() => router.push('/(customer)/loyalty')}
          accessibilityLabel={t('loyalty.rewards_points')}
        >
          <View style={styles.pointsBlob1} />
          <View style={styles.pointsBlob2} />

          <View style={styles.pointsHeader}>
            <View style={styles.pointsTitleRow}>
              <Sparkles size={20} color="#fff" fill="#fff" strokeWidth={1.8} />
              <Text variant="body" weight="semibold" style={styles.pointsTitle}>
                {t('loyalty.rewards_points')}
              </Text>
            </View>
            <ChevronForward size={20} color="rgba(255,255,255,0.75)" />
          </View>

          <View style={styles.pointsValueRow}>
            <Text style={styles.pointsValue}>
              {formatNumber(MOCK_USER_POINTS)}
            </Text>
            <Text style={styles.pointsUnit}>{t('loyalty.points_unit')}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${PROGRESS_PCT}%` }]} />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>
              {t('loyalty.current_tier', { tier: MOCK_TIER_NAME })}
            </Text>
            <Text style={styles.progressLabel}>
              {t('loyalty.points_to_next_tier', { points: MOCK_NEXT_TIER_POINTS, tier: MOCK_NEXT_TIER_NAME })}
            </Text>
          </View>
        </Pressable>

        {/* Group 1: Account & Activity */}
        <View style={styles.group}>
          <Row
            iconBg={PRIMARY_SOFT}
            icon={<User size={20} color={PRIMARY} />}
            label={t('profile.personal_info')}
            onPress={() => router.push('/(shared)/profile/edit')}
            showDivider
          />
          <Row
            iconBg={PRIMARY_SOFT}
            icon={<CalendarDays size={20} color={PRIMARY} />}
            label={t('profile.my_bookings')}
            onPress={() => router.push('/(customer)/bookings')}
            showDivider
          />
          <Row
            iconBg={PRIMARY_SOFT}
            icon={<Heart size={20} color={PRIMARY} />}
            label={t('favorites.title')}
            onPress={() => router.push('/(customer)/favorites')}
            showDivider
          />
          <Row
            iconBg={PRIMARY_SOFT}
            icon={<MapPin size={20} color={PRIMARY} />}
            label={t('profile.addresses')}
            onPress={() => router.push('/(shared)/addresses')}
            showDivider
          />
          <Row
            iconBg={PRIMARY_SOFT}
            icon={<Wallet size={20} color={PRIMARY} />}
            label={t('wallet.title')}
            onPress={() => router.push('/(shared)/wallet')}
            trailing={
              <View style={styles.walletBadge}>
                <Text variant="label" weight="medium" style={styles.walletBadgeText}>
                  {WALLET_BALANCE}
                </Text>
              </View>
            }
          />
        </View>

        {/* Group 2: Preferences */}
        <View style={styles.group}>
          <Row
            iconBg={PRIMARY_TINT}
            icon={<Bell size={20} color={PRIMARY_DARK} />}
            label={t('profile.notifications')}
            sublabel={t('profile.notifications_sub')}
            trailing={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: OUTLINE, true: PRIMARY }}
                thumbColor="#fff"
                ios_backgroundColor={OUTLINE}
              />
            }
            showDivider
            pressable={false}
          />
          <Row
            iconBg={PRIMARY_TINT}
            icon={<Languages size={20} color={PRIMARY_DARK} />}
            label={t('profile.language')}
            onPress={() => setLangSheetOpen(true)}
            trailing={
              <Text variant="label" style={styles.trailingText}>
                {currentLanguageLabel}
              </Text>
            }
            showDivider
          />
          <Row
            iconBg={PRIMARY_TINT}
            icon={<Moon size={20} color={PRIMARY_DARK} />}
            label={t('profile.dark_mode')}
            trailing={
              <Switch
                value={isDark}
                onValueChange={toggleDarkMode}
                trackColor={{ false: OUTLINE, true: PRIMARY }}
                thumbColor="#fff"
                ios_backgroundColor={OUTLINE}
              />
            }
            pressable={false}
          />
        </View>

        {/* Group 3: Support & Actions */}
        <View style={styles.group}>
          <Row
            iconBg={PRIMARY_TINT}
            icon={<HelpCircle size={20} color={PRIMARY_DARK} />}
            label={t('profile.help')}
            onPress={() => router.push('/(shared)/help')}
            showDivider
          />
          <Row
            iconBg={ERROR_SOFT}
            icon={<LogOut size={20} color={ERROR} />}
            label={t('profile.logout')}
            labelColor={ERROR}
            onPress={handleSignOut}
            hideChevron
          />
        </View>

        <Text variant="caption" style={styles.version}>
          {`${t('settings.version')} ${APP_VERSION}`}
        </Text>
      </ScrollView>

      <LanguageSheet
        isOpen={langSheetOpen}
        onClose={() => setLangSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

interface RowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  sublabel?: string;
  labelColor?: string;
  trailing?: React.ReactNode;
  showDivider?: boolean;
  hideChevron?: boolean;
  onPress?: () => void;
  pressable?: boolean;
}

function Row({
  icon,
  iconBg,
  label,
  sublabel,
  labelColor,
  trailing,
  showDivider,
  hideChevron,
  onPress,
  pressable = true,
}: RowProps) {
  const content = (
    <View style={[styles.row, showDivider && styles.rowDivider]}>
      <View style={styles.rowLeading}>
        <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>{icon}</View>
        <View style={styles.rowLabelWrap}>
          <Text
            variant="body"
            weight="medium"
            style={[styles.rowLabel, labelColor ? { color: labelColor } : null]}
          >
            {label}
          </Text>
          {sublabel ? (
            <Text variant="caption" style={styles.rowSublabel}>
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rowTrailing}>
        {trailing}
        {!hideChevron && !trailing ? (
          <ChevronForward size={20} color={MUTED} />
        ) : !hideChevron && trailing ? (
          <ChevronForward size={18} color={MUTED} />
        ) : null}
      </View>
    </View>
  );

  if (!pressable || !onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
      style={({ pressed }) => [pressed && styles.rowPressed]}
    >
      {content}
    </Pressable>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SURFACE },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
  },

  /* Header */
  header: { alignItems: 'center', paddingTop: 8, gap: 12 },
  avatarWrap: { width: 88, height: 88 },
  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: CARD,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: CARD,
    backgroundColor: PRIMARY_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { color: PRIMARY_DARK, fontSize: 28 },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: CARD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  name: { color: DARK, textAlign: 'center', fontSize: 22 },
  tierChip: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 6,
    backgroundColor: PRIMARY_TINT,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tierChipText: { color: PRIMARY_DARK },

  /* Loyalty card */
  pointsCard: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    padding: 18,
    overflow: 'hidden',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  pointsBlob1: {
    position: 'absolute',
    top: -36,
    left: -36,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  pointsBlob2: {
    position: 'absolute',
    bottom: -50,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  pointsHeader: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsTitleRow: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 8,
  },
  pointsTitle: { color: '#fff', fontSize: 18 },
  pointsValueRow: {
    flexDirection: rowDirection,
    alignItems: 'baseline',
    gap: 6,
    marginTop: 10,
  },
  pointsValue: { color: '#fff', fontSize: 32, fontWeight: '700', fontFamily: 'Rubik' },
  pointsUnit: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontFamily: 'Rubik' },
  progressTrack: {
    marginTop: 14,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ACCENT_GOLD,
    borderRadius: 999,
  },
  progressLabels: {
    flexDirection: rowDirection,
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontFamily: 'Rubik' },

  /* Groups */
  group: {
    backgroundColor: CARD,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  /* Rows */
  row: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: OUTLINE },
  rowLeading: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabelWrap: { flex: 1, minWidth: 0, gap: 2 },
  rowLabel: { color: DARK, textAlign: textAlignStart },
  rowSublabel: { color: MUTED, textAlign: textAlignStart, fontSize: 12 },
  rowTrailing: { flexDirection: rowDirection, alignItems: 'center', gap: 8 },
  rowPressed: { backgroundColor: 'rgba(0,0,0,0.025)' },

  walletBadge: {
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  walletBadgeText: { color: PRIMARY_DARK, fontSize: 13 },

  trailingText: { color: MUTED, fontSize: 13 },

  version: {
    textAlign: 'center',
    color: MUTED,
    fontSize: 12,
    marginTop: 8,
  },
});
