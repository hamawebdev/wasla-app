import type { Address } from '../types';

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 'a1',
    label: 'home',
    labelText: 'المنزل',
    fullAddress: 'حي الأمير عبد القادر، شارع 8 مايو 1945، الجزائر العاصمة 16000',
    city: 'الجزائر العاصمة',
    lat: 36.7538,
    lng: 3.0588,
    isDefault: true,
    notes: 'الطابق الثالث، شقة رقم 12',
  },
  {
    id: 'a2',
    label: 'work',
    labelText: 'العمل',
    fullAddress: 'برج بوعريريج، شارع الاستقلال، المركز التجاري 34000',
    city: 'برج بوعريريج',
    lat: 36.0731,
    lng: 4.7637,
    isDefault: false,
  },
];
