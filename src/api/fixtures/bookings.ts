import type { Booking } from '../types';

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    serviceId: 's1',
    providerId: 'p1',
    customerId: 'customer',
    date: '2026-05-20',
    time: '10:00',
    details: 'قندورة للخطوبة، قماش حريري ذهبي',
    address: 'الجزائر العاصمة، حيدرة',
    price: 8500,
    status: 'pending',
    createdAt: '2026-05-10',
  },
  {
    id: 'b2',
    serviceId: 's3',
    providerId: 'p3',
    customerId: 'customer',
    date: '2026-05-15',
    time: '09:00',
    details: 'مكياج عروس وتسريح شعر',
    address: 'وهران، منطقة الأمير',
    price: 5000,
    status: 'confirmed',
    createdAt: '2026-05-08',
  },
  {
    id: 'b3',
    serviceId: 's5',
    providerId: 'p5',
    customerId: 'customer',
    date: '2026-04-28',
    time: '14:00',
    details: 'حلوى جزائرية تقليدية لحفل الخطوبة',
    address: 'قسنطينة، وسط المدينة',
    price: 12000,
    status: 'completed',
    createdAt: '2026-04-20',
  },
  {
    id: 'b4',
    serviceId: 's7',
    providerId: 'p8',
    customerId: 'customer',
    date: '2026-04-10',
    time: '11:00',
    details: 'إصلاح شاشة هاتف آيفون 14',
    price: 3500,
    status: 'completed',
    createdAt: '2026-04-08',
  },
];

export const SERVICE_NAMES: Record<string, string> = {
  s1: 'تفصيل قنادر تقليدية',
  s3: 'مكياج عرائس احترافي',
  s5: 'حلويات جزائرية تقليدية',
  s7: 'إصلاح هواتف وأجهزة',
};

export const PROVIDER_NAMES: Record<string, string> = {
  p1: 'أم رشيد',
  p3: 'حنان بلقاسم',
  p5: 'سارة بن علي',
  p7: 'سميرة حداد',
  p8: 'أسماء بوزيد',
};
