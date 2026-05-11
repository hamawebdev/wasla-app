import type { PaymentMethod } from '../types';

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm1',
    kind: 'baridimob',
    label: 'BaridiMob',
    isDefault: true,
  },
  {
    id: 'pm2',
    kind: 'ccp',
    label: 'حساب CCP',
    last4: '4782',
    isDefault: false,
  },
  {
    id: 'pm3',
    kind: 'cash',
    label: 'الدفع نقداً',
    isDefault: false,
  },
];
