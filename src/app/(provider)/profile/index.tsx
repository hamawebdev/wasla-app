import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import {
  BadgeCheck,
  Bell,
  Camera,
  ChevronLeft,
  Eye,
  HelpCircle,
  Languages,
  LogOut,
  MapPin,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Wallet,
  Zap,
} from 'lucide-react-native';
import * as React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/use-auth-store';

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

const WALLET_BALANCE = '150 د.ج';
const APP_VERSION =
  (Constants?.expoConfig?.version as string | undefined) ?? '2.4.1';

const PROVIDER_RATING = '4.9';
const PROVIDER_REVIEWS = 87;
const PROVIDER_SERVICES = 3;

const PROVIDER_POINTS = 350;
const PROVIDER_NEXT_TIER_POINTS = 150;
const PROVIDER_TIER_NAME = 'الفضية';
const PROVIDER_NEXT_TIER_NAME = 'الذهبية';

const POINTS_PROGRESS_PCT = (() => {
  const target = PROVIDER_POINTS + PROVIDER_NEXT_TIER_POINTS;
  if (target <= 0) return 0;
  return Math.max(4, Math.min(100, (PROVIDER_POINTS / target) * 100));
})();

export default function ProviderProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);
  const profile = useAuthStore.use.profile();

  const userName = profile?.name ?? 'أم رشيد';
  const userAvatar = profile?.avatar;

  const handleSignOut = () => {
    signOut();
    router.replace('/account-picker' as any);
    showMessage({ message: 'تم تسجيل الخروج', type: 'info' });
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
              accessibilityLabel="تغيير صورة الملف الشخصي"
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
              {t('profile.role_provider')}
            </Text>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />

          <View style={styles.heroHeader}>
            <View style={styles.heroTitleRow}>
              <TrendingUp size={20} color="#fff" strokeWidth={2} />
              <Text variant="body" weight="semibold" style={styles.heroTitle}>
                إحصائياتي
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCell}>
              <View style={styles.statValueRow}>
                <Star size={16} color={ACCENT_GOLD} fill={ACCENT_GOLD} strokeWidth={1.8} />
                <Text style={styles.statValue}>{PROVIDER_RATING}</Text>
              </View>
              <Text style={styles.statLabel}>التقييم</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCell}>
              <Text style={styles.statValue}>{PROVIDER_REVIEWS}</Text>
              <Text style={styles.statLabel}>المراجعات</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCell}>
              <Text style={styles.statValue}>{PROVIDER_SERVICES}</Text>
              <Text style={styles.statLabel}>الخدمات</Text>
            </View>
          </View>
        </View>

        {/* Points Card */}
        <Pressable
          style={styles.heroCard}
          onPress={() => {}}
          accessibilityLabel="نقاط مزود الخدمة"
        >
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />

          <View style={styles.heroHeader}>
            <View style={styles.heroTitleRow}>
              <Sparkles size={20} color="#fff" fill="#fff" strokeWidth={1.8} />
              <Text variant="body" weight="semibold" style={styles.heroTitle}>
                نقاط المزود
              </Text>
            </View>
            <ChevronLeft size={20} color="rgba(255,255,255,0.75)" />
          </View>

          <View style={styles.pointsValueRow}>
            <Text style={styles.pointsValue}>
              {PROVIDER_POINTS.toLocaleString('ar-DZ')}
            </Text>
            <Text style={styles.pointsUnit}>نقطة</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${POINTS_PROGRESS_PCT}%` }]} />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>
              {`المستوى الحالي ${PROVIDER_TIER_NAME}`}
            </Text>
            <Text style={styles.progressLabel}>
              {`باقي ${PROVIDER_NEXT_TIER_POINTS} للمستوى ${PROVIDER_NEXT_TIER_NAME}`}
            </Text>
          </View>
        </Pressable>

        {/* Group 1: Account & Activity */}
        <View style={styles.group}>
          <Row
            iconBg={PRIMARY_SOFT}
            icon={<User size={20} color={PRIMARY} />}
            label={t('profile.edit_profile')}
            onPress={() => router.push('/(shared)/profile/edit')}
            showDivider
          />
          <Row
            iconBg={PRIMARY_SOFT}
            icon={<Star size={20} color={PRIMARY} />}
            label="تقييماتي"
            onPress={() => {}}
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
            label="المحفظة"
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

        {/* Group 2: Provider tools */}
        <View style={styles.group}>
          <Row
            iconBg={PRIMARY_TINT}
            icon={<Eye size={20} color={PRIMARY_DARK} />}
            label="معاينة كعميل"
            onPress={() => router.push('/(provider)/profile/preview')}
            showDivider
          />
          <Row
            iconBg={PRIMARY_TINT}
            icon={<Zap size={20} color={PRIMARY_DARK} />}
            label={t('provider.promote_title')}
            onPress={() => router.push('/(provider)/promote')}
          />
        </View>

        {/* Group 3: Preferences */}
        <View style={styles.group}>
          <Row
            iconBg={PRIMARY_TINT}
            icon={<Bell size={20} color={PRIMARY_DARK} />}
            label={t('profile.notifications')}
            onPress={() => router.push('/(shared)/notifications')}
            showDivider
          />
          <Row
            iconBg={PRIMARY_TINT}
            icon={<Languages size={20} color={PRIMARY_DARK} />}
            label={t('profile.language')}
            onPress={() => {
              showMessage({
                message: 'العربية هي اللغة الوحيدة المتاحة حالياً',
                type: 'info',
              });
            }}
            trailing={
              <Text variant="label" style={styles.trailingText}>
                العربية
              </Text>
            }
          />
        </View>

        {/* Group 4: Support & Actions */}
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
          {`الإصدار ${APP_VERSION}`}
        </Text>
      </ScrollView>
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
          <ChevronLeft size={20} color={MUTED} />
        ) : !hideChevron && trailing ? (
          <ChevronLeft size={18} color={MUTED} />
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PRIMARY_TINT,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tierChipText: { color: PRIMARY_DARK },

  /* Hero cards (stats + points) */
  heroCard: {
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
  heroBlob1: {
    position: 'absolute',
    top: -36,
    left: -36,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroBlob2: {
    position: 'absolute',
    bottom: -50,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: { color: '#fff', fontSize: 18 },

  /* Stats card */
  statsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 4,
  },
  statCell: { flex: 1, alignItems: 'center', gap: 4 },
  statValueRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  statValue: { color: '#fff', fontSize: 22, fontWeight: '700', fontFamily: 'Rubik' },
  statLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontFamily: 'Rubik' },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  /* Points card */
  pointsValueRow: {
    flexDirection: 'row-reverse',
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
    flexDirection: 'row-reverse',
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: OUTLINE },
  rowLeading: {
    flexDirection: 'row-reverse',
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
  rowLabel: { color: DARK, textAlign: 'right' },
  rowSublabel: { color: MUTED, textAlign: 'right', fontSize: 12 },
  rowTrailing: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
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
