import { useRouter } from 'expo-router';
import {
  CalendarOff,
  HeartOff,
  MessageCircleOff,
  SearchX,
  WifiOff,
} from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/ui/empty-state';

const ICON_COLOR = 'hsl(198, 21%, 88%)';
const ICON_SIZE = 64;

interface BaseProps {
  onAction?: () => void;
}

export function NoSearchResultsState({ onAction }: BaseProps) {
  const { t } = useTranslation();
  return (
    <EmptyState
      illustration={<SearchX size={ICON_SIZE} color={ICON_COLOR} />}
      title={t('empty.no_results_title')}
      body={t('empty.no_results_body')}
      cta={{ label: t('common.clear'), onPress: onAction ?? (() => {}), variant: 'secondary' }}
    />
  );
}

export function NoBookingsState({ onAction }: BaseProps) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <EmptyState
      illustration={<CalendarOff size={ICON_SIZE} color={ICON_COLOR} />}
      title={t('empty.no_bookings_title')}
      body={t('empty.no_bookings_body')}
      cta={{
        label: t('booking.explore'),
        onPress: onAction ?? (() => router.push('/(customer)/')),
        variant: 'primary',
      }}
    />
  );
}

export function NoInternetState({ onAction }: BaseProps) {
  const { t } = useTranslation();
  return (
    <EmptyState
      illustration={<WifiOff size={ICON_SIZE} color={ICON_COLOR} />}
      title={t('empty.no_internet_title')}
      body={t('empty.no_internet_body')}
      cta={{ label: t('empty.retry'), onPress: onAction ?? (() => {}), variant: 'primary' }}
    />
  );
}

export function EmptyChatListState({ onAction }: BaseProps) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <EmptyState
      illustration={<MessageCircleOff size={ICON_SIZE} color={ICON_COLOR} />}
      title={t('chat.no_chats_title')}
      body={t('chat.no_chats_body')}
      cta={{
        label: t('booking.explore'),
        onPress: onAction ?? (() => router.push('/(customer)/')),
        variant: 'secondary',
      }}
    />
  );
}

export function EmptyFavoritesState({ onAction }: BaseProps) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <EmptyState
      illustration={<HeartOff size={ICON_SIZE} color={ICON_COLOR} />}
      title={t('favorites.empty_title')}
      body={t('favorites.empty_body')}
      cta={{
        label: t('booking.explore'),
        onPress: onAction ?? (() => router.push('/(customer)/')),
        variant: 'secondary',
      }}
    />
  );
}
