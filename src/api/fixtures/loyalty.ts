import type { Badge, PointsTransaction, Reward } from '../types';

export const MOCK_BADGES: Badge[] = [
  { id: 'b1', title: 'أول خطوة', description: 'أكملي أول حجز', icon: '🌟', unlocked: true },
  { id: 'b2', title: 'ناقدة ذهبية', description: 'أرسلي 5 تقييمات', icon: '⭐', unlocked: true },
  { id: 'b3', title: 'وفية', description: 'احجزي من نفس المزوّدة 3 مرات', icon: '💜', unlocked: false },
  { id: 'b4', title: 'ناشطة', description: 'استخدمي التطبيق 7 أيام متتالية', icon: '🔥', unlocked: false },
  { id: 'b5', title: 'سفيرة', description: 'ادعي 3 صديقات', icon: '👑', unlocked: false },
  { id: 'b6', title: 'اكتشافية', description: 'جربي 5 فئات مختلفة', icon: '🗺️', unlocked: true },
];

export const MOCK_REWARDS: Reward[] = [
  { id: 'rw1', title: 'خصم 10% على الحجز التالي', description: 'صالح لمدة شهر واحد', pointsCost: 200 },
  { id: 'rw2', title: 'ظهور مميز لمزودة الخدمة', description: 'ابرزي مزودتكِ المفضلة', pointsCost: 500 },
  { id: 'rw3', title: 'شحن رصيد BaridiMob', description: 'شحن 500 د.ج مباشرة', pointsCost: 1000 },
  { id: 'rw4', title: 'خدمة مجانية', description: 'تصفح واحصلي على خدمة من اختيارك', pointsCost: 2000 },
];

export const MOCK_TRANSACTIONS: PointsTransaction[] = [
  { id: 'pt1', type: 'earned', amount: 5, description: 'تقييم خدمة الخياطة', date: '2025-05-08' },
  { id: 'pt2', type: 'earned', amount: 10, description: 'حجز مكياج العروس', date: '2025-05-01' },
  { id: 'pt3', type: 'spent', amount: 200, description: 'استبدال خصم 10%', date: '2025-04-20' },
  { id: 'pt4', type: 'earned', amount: 5, description: 'تقييم تنظيف المنزل', date: '2025-04-15' },
  { id: 'pt5', type: 'earned', amount: 10, description: 'حجز حلويات', date: '2025-04-10' },
  { id: 'pt6', type: 'earned', amount: 5, description: 'تقييم تنظيم حفل', date: '2025-03-28' },
  { id: 'pt7', type: 'earned', amount: 15, description: 'مكافأة الانضمام', date: '2025-03-01' },
];

export const MOCK_USER_POINTS = 350;
export const MOCK_NEXT_TIER_POINTS = 150;
export const MOCK_TIER_NAME = 'الفضية';
export const MOCK_NEXT_TIER_NAME = 'الذهبية';
