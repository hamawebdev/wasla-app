import * as React from 'react';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { SegmentedControl } from '@/components/wasla/segmented-control';
import {
  MOCK_BADGES,
  MOCK_NEXT_TIER_NAME,
  MOCK_NEXT_TIER_POINTS,
  MOCK_REWARDS,
  MOCK_TIER_NAME,
  MOCK_TRANSACTIONS,
  MOCK_USER_POINTS,
} from '@/api/fixtures/loyalty';
import type { Badge as BadgeType, PointsTransaction, Reward } from '@/api/types';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';
const SUCCESS = 'hsl(142, 71%, 45%)';
const DESTRUCTIVE = 'hsl(0, 84%, 60%)';

const TIER_PROGRESS = MOCK_USER_POINTS / (MOCK_USER_POINTS + MOCK_NEXT_TIER_POINTS);

export default function LoyaltyScreen() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('achievements');

  const handleRedeem = (reward: Reward) => {
    if (MOCK_USER_POINTS < reward.pointsCost) {
      showMessage({ message: t('loyalty.not_enough'), type: 'warning' });
    } else {
      showMessage({
        message: t('loyalty.points_earned', { count: reward.pointsCost }),
        description: reward.title,
        type: 'success',
      });
    }
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      {/* Points header card */}
      <View style={styles.headerCard}>
        <View style={styles.tierInfo}>
          <Badge label={MOCK_TIER_NAME} variant="primary" />
          <Text variant="heading" weight="semibold" style={styles.pointsValue}>
            {t('loyalty.points', { count: MOCK_USER_POINTS })}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${TIER_PROGRESS * 100}%` }]} />
        </View>
        <Text variant="caption" style={styles.nextTierText}>
          {t('loyalty.next_tier', { points: MOCK_NEXT_TIER_POINTS })} — {MOCK_NEXT_TIER_NAME}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrap}>
        <SegmentedControl
          segments={[
            { key: 'achievements', label: t('loyalty.achievements') },
            { key: 'rewards', label: t('loyalty.rewards') },
            { key: 'history', label: t('loyalty.history') },
          ]}
          selected={tab}
          onChange={setTab}
        />
      </View>

      {/* Achievements */}
      {tab === 'achievements' && (
        <View style={styles.badgesGrid}>
          {MOCK_BADGES.map((badge: BadgeType) => (
            <Card key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text variant="label" weight="semibold" style={[styles.badgeTitle, !badge.unlocked && { color: MUTED }]}>
                {badge.title}
              </Text>
              <Text variant="caption" style={styles.badgeDesc} numberOfLines={2}>
                {badge.description}
              </Text>
              {!badge.unlocked && (
                <Text variant="caption" style={styles.lockedLabel}>{t('loyalty.locked')}</Text>
              )}
            </Card>
          ))}
        </View>
      )}

      {/* Rewards */}
      {tab === 'rewards' && (
        <View style={styles.rewardsList}>
          {MOCK_REWARDS.map((reward: Reward) => {
            const canAfford = MOCK_USER_POINTS >= reward.pointsCost;
            return (
              <Card key={reward.id} style={styles.rewardCard}>
                <View style={styles.rewardInfo}>
                  <Text variant="body" weight="semibold" style={{ textAlign: 'right', color: DARK }}>
                    {reward.title}
                  </Text>
                  <Text variant="caption" style={{ textAlign: 'right', color: MUTED }}>
                    {reward.description}
                  </Text>
                </View>
                <View style={styles.rewardAction}>
                  <Text variant="label" weight="semibold" style={{ color: canAfford ? PRIMARY : MUTED }}>
                    {reward.pointsCost} نقطة
                  </Text>
                  <Pressable
                    style={[styles.redeemBtn, !canAfford && styles.redeemBtnDisabled]}
                    onPress={() => handleRedeem(reward)}
                  >
                    <Text variant="caption" weight="semibold" style={{ color: canAfford ? '#fff' : MUTED }}>
                      {t('loyalty.redeem')}
                    </Text>
                  </Pressable>
                </View>
              </Card>
            );
          })}
        </View>
      )}

      {/* History */}
      {tab === 'history' && (
        <View style={styles.historyList}>
          {MOCK_TRANSACTIONS.map((tx: PointsTransaction) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={styles.txLeft}>
                <Text
                  variant="label"
                  weight="semibold"
                  style={{ color: tx.type === 'earned' ? SUCCESS : DESTRUCTIVE }}
                >
                  {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                </Text>
                <Text variant="caption" style={{ color: MUTED }}>{tx.date}</Text>
              </View>
              <Text variant="body" style={styles.txDesc} numberOfLines={1}>
                {tx.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: PRIMARY,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  tierInfo: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  pointsValue: { color: '#fff', fontSize: 28 },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  nextTierText: { textAlign: 'center', color: 'rgba(255,255,255,0.8)' },

  tabsWrap: { paddingHorizontal: 16, marginBottom: 16 },

  badgesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
    paddingBottom: 20,
  },
  badgeCard: {
    width: '30%',
    alignItems: 'center',
    gap: 6,
    padding: 12,
  },
  badgeCardLocked: { opacity: 0.5 },
  badgeIcon: { fontSize: 28 },
  badgeTitle: { textAlign: 'center', color: DARK, fontSize: 12 },
  badgeDesc: { textAlign: 'center', color: MUTED, fontSize: 10 },
  lockedLabel: { color: MUTED, fontSize: 10 },

  rewardsList: { paddingHorizontal: 16, gap: 10, paddingBottom: 20 },
  rewardCard: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12 },
  rewardInfo: { flex: 1, gap: 4 },
  rewardAction: { alignItems: 'center', gap: 8 },
  redeemBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  redeemBtnDisabled: { backgroundColor: 'hsl(200, 20%, 90%)' },

  historyList: { paddingHorizontal: 16, gap: 2, paddingBottom: 20 },
  txRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 12,
  },
  txLeft: { alignItems: 'center', gap: 2, minWidth: 44 },
  txDesc: { flex: 1, textAlign: 'right', color: DARK },
});
