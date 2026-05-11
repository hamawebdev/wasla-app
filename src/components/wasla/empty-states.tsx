import { useRouter } from 'expo-router';
import {
  CalendarOff,
  HeartOff,
  MessageCircleOff,
  SearchX,
  WifiOff,
} from 'lucide-react-native';
import React from 'react';

import { EmptyState } from '@/components/ui/empty-state';

const ICON_COLOR = 'hsl(198, 21%, 88%)';
const ICON_SIZE = 64;

interface BaseProps {
  onAction?: () => void;
}

export function NoSearchResultsState({ onAction }: BaseProps) {
  return (
    <EmptyState
      illustration={<SearchX size={ICON_SIZE} color={ICON_COLOR} />}
      title="لم نجد نتائج مطابقة"
      body="جرّبي تعديل الفلاتر أو ابحثي بكلمات مختلفة"
      cta={{ label: 'مسح الفلاتر', onPress: onAction ?? (() => {}), variant: 'secondary' }}
    />
  );
}

export function NoBookingsState({ onAction }: BaseProps) {
  const router = useRouter();
  return (
    <EmptyState
      illustration={<CalendarOff size={ICON_SIZE} color={ICON_COLOR} />}
      title="لا توجد حجوزات بعد"
      body="استعرضي الخدمات المتاحة وابدئي حجزك الأول"
      cta={{
        label: 'استكشفي الخدمات',
        onPress: onAction ?? (() => router.push('/(customer)/')),
        variant: 'primary',
      }}
    />
  );
}

export function NoInternetState({ onAction }: BaseProps) {
  return (
    <EmptyState
      illustration={<WifiOff size={ICON_SIZE} color={ICON_COLOR} />}
      title="أنتِ غير متصلة بالإنترنت"
      body="تحققي من اتصالك بالشبكة وحاولي مجدداً"
      cta={{ label: 'إعادة المحاولة', onPress: onAction ?? (() => {}), variant: 'primary' }}
    />
  );
}

export function EmptyChatListState({ onAction }: BaseProps) {
  const router = useRouter();
  return (
    <EmptyState
      illustration={<MessageCircleOff size={ICON_SIZE} color={ICON_COLOR} />}
      title="لا توجد محادثات"
      body="ابدئي محادثة مع مقدمة خدمة بعد أول حجز"
      cta={{
        label: 'استكشفي الخدمات',
        onPress: onAction ?? (() => router.push('/(customer)/')),
        variant: 'secondary',
      }}
    />
  );
}

export function EmptyFavoritesState({ onAction }: BaseProps) {
  const router = useRouter();
  return (
    <EmptyState
      illustration={<HeartOff size={ICON_SIZE} color={ICON_COLOR} />}
      title="لم تحفظي أي خدمة بعد"
      body="اضغطي على أيقونة القلب في أي خدمة لحفظها هنا"
      cta={{
        label: 'استكشفي الخدمات',
        onPress: onAction ?? (() => router.push('/(customer)/')),
        variant: 'secondary',
      }}
    />
  );
}
