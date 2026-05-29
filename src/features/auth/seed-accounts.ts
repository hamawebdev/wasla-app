import { MOCK_PROVIDERS } from '@/api/fixtures/providers';

import type { UserProfile, UserRole } from './use-auth-store';

export type SeedAccount = {
  id: 'customer' | 'provider';
  role: UserRole;
  profile: UserProfile;
  setupComplete: boolean;
};

const providerFixture = MOCK_PROVIDERS[0];

export const SEED_ACCOUNTS: SeedAccount[] = [
  {
    id: 'customer',
    role: 'customer',
    profile: {
      name: 'أحمد بن علي',
      phone: '+213555000001',
      avatar: 'https://picsum.photos/seed/customer/80/80',
    },
    setupComplete: false,
  },
  {
    id: 'provider',
    role: 'provider',
    profile: {
      name: providerFixture.name,
      phone: '+213555000002',
      avatar: providerFixture.avatar,
    },
    setupComplete: true,
  },
];
