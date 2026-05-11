import type { Notification } from '../types';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 5);

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'booking',
    title: 'تم تأكيد حجزك',
    description: 'تم تأكيد حجزك لخدمة "خياطة وتفصيل عصري" بتاريخ 15 مايو 2026',
    timestamp: today.toISOString(),
    read: false,
    link: '/(customer)/bookings',
  },
  {
    id: 'n2',
    type: 'message',
    title: 'رسالة جديدة من فاطمة',
    description: 'أهلاً! سأكون متاحة يوم الخميس القادم للتفصيل.',
    timestamp: today.toISOString(),
    read: false,
    link: '/(customer)/chat',
  },
  {
    id: 'n3',
    type: 'promo',
    title: 'عرض خاص لك 🎉',
    description: 'احصلي على خصم 20% على أول حجز لخدمات التنظيف هذا الأسبوع',
    timestamp: today.toISOString(),
    read: true,
  },
  {
    id: 'n4',
    type: 'booking',
    title: 'تذكير بموعدك',
    description: 'لديكِ حجز غداً الساعة 10:00 صباحاً لخدمة "تجميل العرائس"',
    timestamp: yesterday.toISOString(),
    read: false,
    link: '/(customer)/bookings',
  },
  {
    id: 'n5',
    type: 'system',
    title: 'تم إضافة نقاط مكافأة',
    description: 'تم إضافة 50 نقطة إلى رصيدك بعد اكتمال آخر حجز.',
    timestamp: yesterday.toISOString(),
    read: true,
  },
  {
    id: 'n6',
    type: 'booking',
    title: 'تم إلغاء الحجز',
    description: 'تأسفنا، تم إلغاء حجزك لخدمة "وجبات صحية" من قِبل مقدمة الخدمة.',
    timestamp: lastWeek.toISOString(),
    read: true,
  },
  {
    id: 'n7',
    type: 'message',
    title: 'رسالة جديدة من نور',
    description: 'شكراً على تقييمك الرائع! يسعدني خدمتك دائماً.',
    timestamp: lastWeek.toISOString(),
    read: true,
  },
  {
    id: 'n8',
    type: 'promo',
    title: 'خدمات جديدة في حيّك',
    description: 'تم إضافة 5 مزودات خدمات جديدات على بُعد أقل من 2 كم منكِ',
    timestamp: lastWeek.toISOString(),
    read: true,
  },
];
